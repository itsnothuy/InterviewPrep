/**
 * @deprecated This module is DEPRECATED. Use lib/server/ollama.ts instead.
 * 
 * Server-only Gemini AI client - KEPT FOR FALLBACK/REFERENCE ONLY.
 * This module MUST NOT be imported from client components.
 * The "server-only" import ensures build-time errors if imported from client.
 * 
 * Migration: Gemini → Ollama (Llama 3.1)
 * See OLLAMA_MIGRATION_PLAN.md for details.
 */
import "server-only";

// DEPRECATED: Google Gemini imports - uncomment only if rolling back
// import { GoogleGenAI } from "@google/genai";

// Use non-public env var - this is server-only
const apiKey = process.env.GEMINI_API_KEY;

// DEPRECATED: Removed hard requirement for Gemini API key
// Now using Ollama instead
if (!apiKey) {
  console.warn(
    "GEMINI_API_KEY not set. This is OK if using Ollama. " +
    "Set it only if you need Gemini fallback."
  );
}

// DEPRECATED: Gemini client initialization
// const genAI = new GoogleGenAI({ apiKey });

/**
 * @deprecated Use lib/server/ollama.ts getOllamaModel() instead
 * Get a configured Gemini model for chat/generation
 */
export function getGeminiModel(modelName: string = "gemini-2.0-flash-lite") {
  console.warn("DEPRECATED: getGeminiModel() - Use Ollama instead");
  // return { genAI, modelName };
  return { modelName, deprecated: true };
}

/**
 * @deprecated Use Ollama configuration instead
 * Get generation config for Gemini chat
 */
export function getGeminiChatConfig() {
  console.warn("DEPRECATED: getGeminiChatConfig() - Use Ollama instead");
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE",
    },
  ];

  return { generationConfig, safetySettings };
}

/**
 * @deprecated Use lib/server/ollama.ts generateContent() instead
 * Generate content using Gemini model
 */
export async function generateContent(prompt: string, modelName: string = "gemini-2.0-flash-lite") {
  console.warn("DEPRECATED: generateContent() in gemini.ts - Use Ollama instead");
  // DEPRECATED: Gemini implementation
  // const response = await genAI.models.generateContent({
  //   model: modelName,
  //   contents: prompt,
  // });
  // return response;
  
  throw new Error(
    "Gemini is deprecated. Use lib/server/ollama.ts instead. " +
    "If you need Gemini fallback, uncomment the GoogleGenAI imports and client initialization."
  );
}

/**
 * @deprecated Use lib/server/ollama.ts instead
 * Get the raw GoogleGenAI instance for advanced use cases
 */
export function getGeminiClient() {
  console.warn("DEPRECATED: getGeminiClient() - Use Ollama instead");
  // return genAI;
  throw new Error(
    "Gemini is deprecated. Use lib/server/ollama.ts instead."
  );
}
