// Version 1
// "use client";

// import Editor from "@monaco-editor/react";
// import { useEffect, useRef, useState } from "react";
// import LanguageSelector from "./language-selector";
// import Output from "./output";
// import { CODE_SNIPPETS, Language } from "@/components/chat/code-constants";

// interface CodeEditorBlockProps {
//   initialCode?: string;              // or just string if it's mandatory
//   onCodeChange?: (code: string) => void;
//   // any other props you need...
// }

// const CodeEditorBlock: React.FC<CodeEditorBlockProps> = ({
//   initialCode = "",
//   onCodeChange,
// }) => {
//   const editorRef = useRef<any>(null);
//   const [value, setValue] = useState<string>("");
//   const [editorValue, setEditorValue] = useState<string>(initialCode);
  
//   const [language, setLanguage] = useState<[Language, string]>([
//     "java",
//     "15.0.2",
//   ]);
  
//   useEffect(() => {
//     setEditorValue(initialCode);
//   }, [initialCode]);

//   const onMount = (editor: any) => {
//     editorRef.current = editor;
//     editor.focus();
//   };

//   // Called whenever the user types in the editor
//   const handleEditorChange = (newValue: string | undefined) => {
//     const updatedValue = newValue || "";
//     setEditorValue(updatedValue);
//     // If parent provided onCodeChange, call it
//     if (onCodeChange) {
//       onCodeChange(updatedValue);
//     }
//   };

//   // Called when the user picks a new language from the LanguageSelector
//   const onSelectLanguage = (selectedLanguage: [Language, string]) => {
//     setLanguage(selectedLanguage);

//     // If you want to reset the editor each time user changes language:
//     setEditorValue(CODE_SNIPPETS[selectedLanguage[0]]);
//     if (onCodeChange) {
//       onCodeChange(CODE_SNIPPETS[selectedLanguage[0]]);
//     }

//     // Otherwise, keep the user’s current code intact.
//   };
  
//   const onSelect = (selectedLanguage: [Language, string]) => {
//     setLanguage(selectedLanguage);
//     setValue(CODE_SNIPPETS[selectedLanguage[0]]);
//   };
//   console.log(value);

//   return (
//     <div className="flex">
//       <div className="w-1/2 pr-3">
//         <LanguageSelector language={language} onSelect={onSelect} />
//         <Editor
//           height="75vh"
//           theme="vs-dark"
//           language={language[0]}
//           defaultValue={CODE_SNIPPETS[language[0]]}
//           value={value}
//           onMount={onMount}
//           onChange={(value) => handleEditorChange(value)}
//           options={{
//             padding: { top: 5 },
//             // P1.5: Monaco accessibility configuration
//             accessibilitySupport: "on",
//             ariaLabel: `Code editor for ${language[0]}`,
//             accessibilityHelpUrl: "https://github.com/microsoft/monaco-editor/wiki/Monaco-Editor-Accessibility-Guide",
//             screenReaderAnnounceInlineSuggestion: true,
//             cursorBlinking: "smooth",
//             smoothScrolling: true,
//             // Better keyboard navigation
//             quickSuggestions: true,
//             tabCompletion: "on",
//             // Screen reader optimizations
//             renderWhitespace: "selection",
//             renderControlCharacters: true,
//           }}
//         />
//       </div>
//       <div className="w-1/2">
//         <Output editorRef={editorRef} language={language} />
//       </div>
//     </div>
//   );
// };

// export default CodeEditorBlock;

"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState, useCallback } from "react";
import LanguageSelector from "./language-selector";
import Output from "./output";
import { CODE_SNIPPETS, Language } from "@/components/chat/code-constants";
import { executeCode } from "@/app/api/get-code/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@mui/material";

interface CodeEditorBlockProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  showHeader?: boolean; // Optional header display
  headerTitle?: string; // Customizable title
}

const CodeEditorBlock: React.FC<CodeEditorBlockProps> = ({
  initialCode = "",
  onCodeChange,
  showHeader = false,
  headerTitle = "Code Editor",
}) => {
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>(initialCode);
  
  const [language, setLanguage] = useState<[Language, string]>([
    "java",
    "15.0.2",
  ]);
  
  // Resizable rows state (top-bottom layout)
  const [editorHeight, setEditorHeight] = useState<number>(60); // Editor takes 60% by default
  const [isOutputVisible, setIsOutputVisible] = useState<boolean>(true); // Output visibility
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Output state (lifted from Output component)
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string>("");
  const { toast } = useToast();
  const lastExecutionRef = useRef<number>(0);
  const RATE_LIMIT_MS = 2000;
  
  useEffect(() => {
    setEditorValue(initialCode);
  }, [initialCode]);

  // Run Code function (lifted from Output component)
  const runCode = useCallback(async () => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionRef.current;
    
    // Show output panel when Run Code is clicked
    if (!isOutputVisible) {
      setIsOutputVisible(true);
    }
    
    if (timeSinceLastExecution < RATE_LIMIT_MS && lastExecutionRef.current !== 0) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - timeSinceLastExecution) / 1000);
      toast({
        variant: "warning",
        title: "Please Wait",
        description: `Rate limit: Wait ${waitTime} second(s) before running again.`,
      });
      return;
    }

    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) {
      toast({
        variant: "warning",
        title: "No Code to Execute",
        description: "Please write some code before running.",
      });
      return;
    }
    
    try {
      lastExecutionRef.current = now;
      setIsLoading(true);
      setExecutionMessage("Executing code...");
      const result = await executeCode(language[0], sourceCode);
      setOutput(result.run.output.split("\n"));
      
      if (result.run.stderr) {
        setError(true);
        setExecutionMessage("Execution completed with errors");
        toast({
          variant: "destructive",
          title: "Execution Error",
          description: "Your code executed but produced errors. Check the output panel.",
        });
      } else {
        setError(false);
        setExecutionMessage("Execution completed successfully");
        toast({
          variant: "success",
          title: "Success",
          description: `Code executed successfully in ${language[0]}`,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data || "An error occurred";
      setOutput([errorMsg]);
      setError(true);
      setExecutionMessage(`Execution failed: ${errorMsg}`);
      toast({
        variant: "destructive",
        title: "Execution Failed",
        description: errorMsg,
      });
      console.error("Error executing code:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  }, [editorRef, language, toast, isOutputVisible]);

  // Resizer handlers (for top-bottom layout)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseY = e.clientY - containerRect.top;
    const totalHeight = containerRect.height;

    let percentage = (mouseY / totalHeight) * 100;
    // Clamp between 30% and 85% for better usability
    const newHeight = Math.min(Math.max(percentage, 30), 85);
    setEditorHeight(newHeight);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "default";
  }, []);

  // Add/remove document event listeners
  useEffect(() => {
    if (isDragging.current) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  // Called whenever the user types in the editor
  const handleEditorChange = (newValue: string | undefined) => {
    const updatedValue = newValue || "";
    setEditorValue(updatedValue);
    // If parent provided onCodeChange, call it
    if (onCodeChange) {
      onCodeChange(updatedValue);
    }
  };

  // Called when the user picks a new language from the LanguageSelector
  const onSelectLanguage = (selectedLanguage: [Language, string]) => {
    setLanguage(selectedLanguage);

    // If you want to reset the editor each time user changes language:
    setEditorValue(CODE_SNIPPETS[selectedLanguage[0]]);
    if (onCodeChange) {
      onCodeChange(CODE_SNIPPETS[selectedLanguage[0]]);
    }

    // Otherwise, keep the user’s current code intact.
  };
  
  const onSelect = (selectedLanguage: [Language, string]) => {
    setLanguage(selectedLanguage);
    setValue(CODE_SNIPPETS[selectedLanguage[0]]);
  };
  console.log(value);

  // P1.3: Use flex-1 for flexible height instead of fixed 75vh
  return (
    <div className="flex flex-col h-full">
      {/* Optional Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-[#393939] bg-[#161616]">
          <h2 className="text-sm font-medium text-[#f4f4f4]">
            {headerTitle}
          </h2>
          <div className="flex items-center gap-2">
            {/* Toggle Output Button */}
            <Button
              variant={"dashboard"}
              className="border border-carbon-border-strong text-black hover:bg-carbon-text-secondary hover:text-white"
              onClick={() => setIsOutputVisible(!isOutputVisible)}
              aria-label={isOutputVisible ? "Hide output panel" : "Show output panel"}
            >
              {isOutputVisible ? "Hide Output" : "Show Output"}
            </Button>
            {/* Run Code Button */}
            <Button
              variant={"dashboard"}
              className="border border-carbon-border-strong text-black hover:bg-carbon-success hover:text-white"
              onClick={runCode}
              disabled={isLoading}
              aria-label={isLoading ? "Executing code, please wait" : "Run code"}
            >
              {isLoading ? <CircularProgress className="text-black" size={20} /> : "Run Code"}
            </Button>
          </div>
        </div>
      )}
      
      {/* Editor and Output Container - TOP TO BOTTOM LAYOUT */}
      <div ref={containerRef} className="flex flex-col h-full flex-1 relative">
        {/* Editor Panel - Top */}
        <div 
          className="flex flex-col relative" 
          style={{ height: isOutputVisible ? `${editorHeight}%` : '100%' }}
        >
          <LanguageSelector language={language} onSelect={onSelect} />
          
          <Editor
            height="100%"
            theme="vs-dark"
            language={language[0]}
            defaultValue={CODE_SNIPPETS[language[0]]}
            value={value}
            onMount={onMount}
            onChange={(value) => handleEditorChange(value)}
            options={{
              padding: { top: 5 },
              // P1.5: Monaco accessibility configuration
              accessibilitySupport: "on",
              ariaLabel: `Code editor for ${language[0]}`,
              accessibilityHelpUrl: "https://github.com/microsoft/monaco-editor/wiki/Monaco-Editor-Accessibility-Guide",
              screenReaderAnnounceInlineSuggestion: true,
              cursorBlinking: "smooth",
              smoothScrolling: true,
              // Better keyboard navigation
              quickSuggestions: true,
              tabCompletion: "on",
              // Screen reader optimizations
              renderWhitespace: "selection",
              renderControlCharacters: true,
            }}
          />
        </div>
        
        {/* Resizer Divider - Only show when output is visible */}
        {isOutputVisible && (
          <div
            className="h-1 bg-[#393939] hover:bg-[#0f62fe] cursor-row-resize transition-colors flex-shrink-0"
            onMouseDown={handleMouseDown}
            style={{ userSelect: "none", touchAction: "none" }}
          />
        )}
        
        {/* Output Panel - Bottom - Only show when isOutputVisible is true */}
        {isOutputVisible && (
          <div 
            className="flex flex-col flex-1"
            style={{ height: `${100 - editorHeight}%` }}
          >
            <Output 
              editorRef={editorRef} 
              language={language}
              output={output}
              isLoading={isLoading}
              isError={isError}
              executionMessage={executionMessage}
              runCode={runCode}
              showRunButton={!showHeader}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditorBlock;
