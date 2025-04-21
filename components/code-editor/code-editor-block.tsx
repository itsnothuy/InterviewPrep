"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import LanguageSelector from "./language-selector";
import Output from "./output";
import { CODE_SNIPPETS, Language } from "@/components/chat/code-constants";

interface CodeEditorBlockProps {
  initialCode?: string;              // or just string if it's mandatory
  onCodeChange?: (code: string) => void;
  // any other props you need...
}

const CodeEditorBlock: React.FC<CodeEditorBlockProps> = ({
  initialCode = "",
  onCodeChange,
}) => {
  const editorRef = useRef<any>(null);
  const [value, setValue] = useState<string>("");
  const [editorValue, setEditorValue] = useState<string>(initialCode);
  
  const [language, setLanguage] = useState<[Language, string]>([
    "java",
    "15.0.2",
  ]);
  
  useEffect(() => {
    setEditorValue(initialCode);
  }, [initialCode]);

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

  return (
    <div className="flex">
      <div className="w-1/2 pr-3 ">
        <LanguageSelector language={language} onSelect={onSelect} />
        <Editor
          height="75vh"
          theme="vs-dark"
          language={language[0]}
          defaultValue={CODE_SNIPPETS[language[0]]}
          value={value}
          onMount={onMount}
          onChange={(value) => handleEditorChange(value)}
          options={{
            padding: { top: 5 } // Adjust the top padding value as needed
          }}
        />
      </div>
      <div className="w-1/2">
        <Output editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default CodeEditorBlock;
