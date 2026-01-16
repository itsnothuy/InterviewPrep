import { executeCode } from "@/app/api/get-code/api";
import { Button } from "../ui/button";
import { useState, RefObject, useRef, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { Language } from "@/components/chat/code-constants";
import { useToast } from "@/components/ui/use-toast";

interface OutputProps {
  editorRef: RefObject<any>;
  language: [Language, string];
  // New props for lifted state
  output?: string[];
  isLoading?: boolean;
  isError?: boolean;
  executionMessage?: string;
  runCode?: () => void;
  showRunButton?: boolean;
}

const Output: React.FC<OutputProps> = ({ 
  editorRef, 
  language,
  output: propsOutput,
  isLoading: propsIsLoading,
  isError: propsIsError,
  executionMessage: propsExecutionMessage,
  runCode: propsRunCode,
  showRunButton = true,
}) => {
  // Use local state if props not provided (backwards compatibility)
  const [localOutput, setLocalOutput] = useState<string[]>([]);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localIsError, setLocalError] = useState(false);
  const [localExecutionMessage, setLocalExecutionMessage] = useState<string>("");
  const { toast } = useToast();
  
  // P1.7: Rate limiting - track last execution time
  const lastExecutionRef = useRef<number>(0);
  const RATE_LIMIT_MS = 2000; // 2 seconds between executions

  // Use props if available, otherwise use local state
  const output = propsOutput !== undefined ? propsOutput : localOutput;
  const isLoading = propsIsLoading !== undefined ? propsIsLoading : localIsLoading;
  const isError = propsIsError !== undefined ? propsIsError : localIsError;
  const executionMessage = propsExecutionMessage !== undefined ? propsExecutionMessage : localExecutionMessage;

  const localRunCode = useCallback(async () => {
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
      setLocalIsLoading(true);
      setLocalExecutionMessage("Executing code...");
      const result = await executeCode(language[0], sourceCode);
      setLocalOutput(result.run.output.split("\n"));
      
      if (result.run.stderr) {
        setLocalError(true);
        setLocalExecutionMessage("Execution completed with errors");
        toast({
          variant: "destructive",
          title: "Execution Error",
          description: "Your code executed but produced errors. Check the output panel.",
        });
      } else {
        setLocalError(false);
        setLocalExecutionMessage("Execution completed successfully");
        toast({
          variant: "success",
          title: "Success",
          description: `Code executed successfully in ${language[0]}`,
        });
      }
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data || "An error occurred";
      setLocalOutput([errorMsg]);
      setLocalError(true);
      setLocalExecutionMessage(`Execution failed: ${errorMsg}`);
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
      setLocalIsLoading(false);
    }
  }, [editorRef, language, toast]);

  // Use prop runCode if available, otherwise use local
  const runCode = propsRunCode || localRunCode;

  return (
    <div className=" h-full">
      {showRunButton && (
        <div className="flex flex-row gap-3">
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
      )}
      {/* P0.3: Add aria-live region for screen reader announcements */}
      <div 
        className="h-full border border-carbon-border-medium rounded-sm"
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
