import { executeCode } from "@/app/api/get-code/api";
import { Button } from "./ui/button";
import { useState, RefObject } from "react";
import { CircularProgress } from "@mui/material";
import { Language } from "@/app/code-constants";

interface OutputProps {
  editorRef: RefObject<any>;
  language: [Language, string];
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const result = await executeCode(language[0], sourceCode);
      setOutput(result.run.output.split("\n"));
      result.run.stderr ? setError(true) : setError(false);
    } catch (error: any) {
      console.error(
        "Error executing code:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" h-full mb-10 pb-10">
      <div className="flex flex-row gap-3">
        <h1 className="text-lg font-semibold">Output</h1>
        <Button
          variant={"outline"}
          color="green"
          className="mb-4 border border-slate-800 text-green-700 hover:bg-green-500 hover:text-white"
          onClick={runCode}
        >
          {isLoading ? <CircularProgress size={24} /> : "Run Code"}
        </Button>
      </div>
      <div className="h-full p-2 border border-gray-500 rounded-sm">
        <div className={isError ? "text-red-500" : "text-slate-600"}>
          {output.length > 0 ? (
            output.map((line, index) => <p key={index}>{line}</p>)
          ) : (
            <p>Click Run Code to see the output here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Output;
