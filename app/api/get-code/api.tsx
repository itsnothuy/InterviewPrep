import axios from "axios";
import { LANGUAGE_VERSIONS, Language } from "@/components/chat/code-constants";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

interface ExecuteCodeResponse {
  run: {
    output: string;
    stderr: string;
  };
}

export const executeCode = async (
  language: Language,
  sourceCode: string
): Promise<ExecuteCodeResponse> => {
  const payload = {
    language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
    // P0.2: Add 10-second timeout for code execution
    compile_timeout: 10000,
    run_timeout: 10000,
  };

  try {
    // P0.2: Set axios request timeout to 12 seconds (slightly more than execution timeout)
    const response = await API.post("/execute", payload, {
      timeout: 12000,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle timeout specifically
      if (error.code === 'ECONNABORTED') {
        throw new Error('Code execution timed out after 10 seconds');
      }
      console.error(
        "Error executing code:",
        error.response?.data || error.message
      );
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};
