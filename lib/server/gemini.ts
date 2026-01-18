/**
 * Server-only Gemini AI client.
 * This module MUST NOT be imported from client components.
 * The "server-only" import ensures build-time errors if imported from client.
 * 
 * Updated to use @google/genai (new SDK) instead of deprecated @google/generative-ai
 */
import "server-only";

import { GoogleGenAI } from "@google/genai";

// Use non-public env var - this is server-only
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY environment variable is not set. " +
    "Please add it to your .env file (NOT as NEXT_PUBLIC_*)."
  );
}

const genAI = new GoogleGenAI({ apiKey });

/**
 * Get a configured Gemini model for chat/generation
 * Note: New API uses ai.models.generateContent() pattern
 */
export function getGeminiModel(modelName: string = "gemini-2.0-flash-lite") {
  return { genAI, modelName };
}

/**
 * Get generation config for Gemini chat
 * New API: Safety settings and generation config are passed to generateContent()
 */
export function getGeminiChatConfig() {
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
 * Generate content using Gemini model
 * New API pattern: ai.models.generateContent()
 */
export async function generateContent(prompt: string, modelName: string = "gemini-2.0-flash-lite") {
  const response = await genAI.models.generateContent({
    model: modelName,
    contents: prompt,
  });
  
  return response;
}

/**
 * Get the raw GoogleGenAI instance for advanced use cases
 */
export function getGeminiClient() {
  return genAI;
}
