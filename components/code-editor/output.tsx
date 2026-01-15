import { executeCode } from "@/app/api/get-code/api";
import { Button } from "../ui/button";
import { useState, RefObject } from "react";
import { CircularProgress } from "@mui/material";
import { Language } from "@/components/chat/code-constants";

interface OutputProps {
  editorRef: RefObject<any>;
  language: [Language, string];
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string>("");

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      setExecutionMessage("Executing code...");
      const result = await executeCode(language[0], sourceCode);
      setOutput(result.run.output.split("\n"));
      result.run.stderr ? setError(true) : setError(false);
      setExecutionMessage(result.run.stderr ? "Execution completed with errors" : "Execution completed successfully");
    } catch (error: any) {
      const errorMsg = error.message || error.response?.data || "An error occurred";
      setOutput([errorMsg]);
      setError(true);
      setExecutionMessage(`Execution failed: ${errorMsg}`);
      console.error(
        "Error executing code:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" h-full mb-11 pb-14">
      <div className="flex flex-row gap-3">
        {/* <h1 className="text-lg font-semibold">Output</h1> */}
        <Button
          variant={"dashboard"}
          color="green"
          className="mb-5 border border-slate-800 text-black hover:bg-green-500 hover:text-white"
          onClick={runCode}
          disabled={isLoading}
          aria-label={isLoading ? "Executing code, please wait" : "Run code"}
        >
          {isLoading ? <CircularProgress className="text-black" size={24} /> : "Run Code"}
        </Button>
      </div>
      {/* P0.3: Add aria-live region for screen reader announcements */}
      <div 
        className="h-full p-2 border border-gray-500 rounded-sm"
        role="region"
        aria-label="Code execution output"
      >
        <div 
          className={isError ? "text-red-500" : "text-slate-600"}
          aria-live="polite"
          aria-atomic="true"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} className="text-gray-600" />
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
