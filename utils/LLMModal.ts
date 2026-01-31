/**
 * LLM Modal - Unified AI Interface
 * 
 * This module provides a unified interface for AI text generation.
 * Currently configured to use Ollama with Llama 3.1.
 * 
 * NOTE: This is a CLIENT-SAFE module. It calls our API routes,
 * not Ollama directly (since Ollama runs server-side).
 * 
 * For backwards compatibility, this exports the same `chatSession` interface
 * that the old GeminiAIModal.ts provided.
 */

// Configuration - these should match your API endpoint expectations
const LLM_API_ENDPOINT = "/api/llm/generate";

interface ChatResponse {
  response: {
    text: () => string;
  };
}

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Generate a response from the LLM via our API
 * 
 * @param prompt - The prompt to send to the LLM
 * @param options - Optional generation parameters
 * @returns The generated response
 */
export async function generateChatResponse(
  prompt: string,
  options: GenerateOptions = {}
): Promise<{ text: string }> {
  try {
    const response = await fetch(LLM_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        ...options,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `LLM API failed: ${response.status}`
      );
    }

    const data = await response.json();
    return { text: data.text || data.response || "" };
  } catch (error) {
    console.error("Error in generateChatResponse:", error);
    throw error;
  }
}

/**
 * Backwards compatible chat session object
 * Mimics the old Gemini API structure for existing code
 * 
 * Usage:
 * ```
 * const result = await chatSession.sendMessage("Your prompt");
 * const text = result.response.text();
 * ```
 */
export const chatSession = {
  async sendMessage(prompt: string): Promise<ChatResponse> {
    const response = await generateChatResponse(prompt);
    
    // Return object that mimics old Gemini API structure
    return {
      response: {
        text: () => response.text,
      },
    };
  },
};

/**
 * Direct text generation (simpler API)
 * 
 * Usage:
 * ```
 * const text = await generateText("Your prompt");
 * ```
 */
export async function generateText(prompt: string): Promise<string> {
  const response = await generateChatResponse(prompt);
  return response.text;
}

/**
 * Check if the LLM service is available
 */
export async function checkLLMAvailable(): Promise<boolean> {
  try {
    const response = await fetch("/api/llm/health");
    return response.ok;
  } catch {
    return false;
  }
}
