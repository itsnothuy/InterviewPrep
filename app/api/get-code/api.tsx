import axios from "axios";
import { LANGUAGE_VERSIONS, Language } from "@/app/code-constants";

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
  };

  try {
    const response = await API.post("/execute", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
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
