import { executeCode } from "@/app/api/get-code/api";
import { Button } from "../ui/button";
import { useState, RefObject, useRef, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { Language } from "@/components/chat/code-constants";
import { useToast } from "@/components/ui/use-toast";

interface OutputProps {
  editorRef: RefObject<any>;
  language: [Language, string];
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string>("");
  const { toast } = useToast();
  
  // P1.7: Rate limiting - track last execution time
  const lastExecutionRef = useRef<number>(0);
  const RATE_LIMIT_MS = 2000; // 2 seconds between executions

  const runCode = useCallback(async () => {
    // P1.7: Check rate limit
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecutionRef.current;
    
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
      lastExecutionRef.current = now; // P1.7: Update last execution time
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
      console.error(
        "Error executing code:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  }, [editorRef, language, toast]);

  return (
    <div className=" h-full mb-11 pb-14">
      <div className="flex flex-row gap-3">
        {/* <h1 className="text-lg font-semibold">Output</h1> */}
        <Button
          variant={"dashboard"}
          color="green"
          className="mb-5 border border-carbon-border-strong text-black hover:bg-carbon-success hover:text-white"
          onClick={runCode}
          disabled={isLoading}
          aria-label={isLoading ? "Executing code, please wait" : "Run code"}
        >
          {isLoading ? <CircularProgress className="text-black" size={24} /> : "Run Code"}
        </Button>
      </div>
      {/* P0.3: Add aria-live region for screen reader announcements */}
      <div 
        className="h-full p-2 border border-carbon-border-medium rounded-sm"
        role="region"
        aria-label="Code execution output"
      >
        <div 
          className={isError ? "text-carbon-error" : "text-carbon-text-secondary"}
          aria-live="polite"
          aria-atomic="true"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} className="text-carbon-text-tertiary" />
              <p>Executing code, please wait...</p>
            </div>
          ) : output.length > 0 ? (
            output.map((line, index) => <p key={index}>{line}</p>)
          ) : (
            <p>Click Run Code to see the output here...</p>
          )}
        </div>
        {/* Hidden message for screen readers */}
        <span className="sr-only" aria-live="polite">
          {executionMessage}
        </span>
      </div>
    </div>
  );
};

export default Output;
