/**
 * Server-only Ollama AI client.
 * This module MUST NOT be imported from client components.
 * The "server-only" import ensures build-time errors if imported from client.
 * 
 * Replaces Google Gemini with local Ollama for text generation.
 */
import "server-only";

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:70b";

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: OllamaChatMessage;
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

/**
 * Check if Ollama is available and running
 */
export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    return response.ok;
  } catch (error) {
    console.error("Ollama health check failed:", error);
    return false;
  }
}

/**
 * List available models in Ollama
 */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error(`Failed to list models: ${response.statusText}`);
    }
    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch (error) {
    console.error("Error listing Ollama models:", error);
    return [];
  }
}

/**
 * Generate text using Ollama (non-streaming)
 */
export async function generateContent(
  prompt: string,
  modelName: string = OLLAMA_MODEL
): Promise<{ text: string }> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.95,
          top_k: 64,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama generate failed: ${response.status} - ${errorText}`);
    }

    const data: OllamaGenerateResponse = await response.json();
    return { text: data.response };
  } catch (error) {
    console.error("Error generating content with Ollama:", error);
    throw error;
  }
}

/**
 * Chat with Ollama (non-streaming) - supports message history
 */
export async function chatCompletion(
  messages: OllamaChatMessage[],
  modelName: string = OLLAMA_MODEL
): Promise<{ text: string; message: OllamaChatMessage }> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.95,
          top_k: 64,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama chat failed: ${response.status} - ${errorText}`);
    }

    const data: OllamaChatResponse = await response.json();
    return {
      text: data.message.content,
      message: data.message,
    };
  } catch (error) {
    console.error("Error in Ollama chat completion:", error);
    throw error;
  }
}

/**
 * Stream chat with Ollama - returns an async generator
 */
export async function* streamChatCompletion(
  messages: OllamaChatMessage[],
  modelName: string = OLLAMA_MODEL
): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.95,
          top_k: 64,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama stream chat failed: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim());

      for (const line of lines) {
        try {
          const data: OllamaChatResponse = JSON.parse(line);
          if (data.message?.content) {
            yield data.message.content;
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    }
  } catch (error) {
    console.error("Error in Ollama stream chat:", error);
    throw error;
  }
}

/**
 * Stream generate with Ollama - returns a ReadableStream for Response
 */
export async function streamGenerate(
  messages: OllamaChatMessage[],
  modelName: string = OLLAMA_MODEL
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelName,
      messages: messages,
      stream: true,
      options: {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 64,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama stream failed: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("No response body reader available");
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const data: OllamaChatResponse = JSON.parse(line);
              if (data.message?.content) {
                controller.enqueue(encoder.encode(data.message.content));
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });
}

/**
 * Get configuration info
 */
export function getOllamaConfig() {
  return {
    baseUrl: OLLAMA_BASE_URL,
    model: OLLAMA_MODEL,
  };
}

/**
 * Get the Ollama model for chat/generation (compatibility with old Gemini API)
 */
export function getOllamaModel(modelName: string = OLLAMA_MODEL) {
  return { modelName, baseUrl: OLLAMA_BASE_URL };
}
