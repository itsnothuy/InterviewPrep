/**
 * GeminiAIModal - Now using Ollama with Llama 3.1
 * 
 * This file maintains backwards compatibility with existing code.
 * Internally, it now uses Ollama instead of Google Gemini.
 * 
 * NOTE: This is used by CLIENT-SIDE components, so it calls our API route
 * instead of Ollama directly.
 */

// Keep old imports for reference (commented out)
// import { GoogleGenAI } from "@google/genai";
// const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
// const genAI = new GoogleGenAI({ apiKey });

// API endpoint for LLM generation (proxies to Ollama server-side)
const LLM_API_ENDPOINT = "/api/llm/generate";

interface GenerateResponse {
  text: string;
  model?: string;
}

// Export function to generate content
export async function generateChatResponse(
  prompt: string,
  _modelName: string = "llama3.1:70b" // Model name param kept for compatibility, actual model set server-side
): Promise<GenerateResponse> {
  try {
    const response = await fetch(LLM_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `LLM API failed: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.text || "" };
  } catch (error) {
    console.error("Error in generateChatResponse:", error);
    throw error;
  }
}

// Backwards compatible chat session object
// Mimics the old Gemini API for existing code
export const chatSession = {
  async sendMessage(prompt: string) {
    const response = await generateChatResponse(prompt);
    // Return object that mimics old Gemini API structure
    return {
      response: {
        text: () => response.text || ""
      }
    };
  }
};

