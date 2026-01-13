/**
 * Server-only Gemini AI client.
 * This module MUST NOT be imported from client components.
 * The "server-only" import ensures build-time errors if imported from client.
 */
import "server-only";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Use non-public env var - this is server-only
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY environment variable is not set. " +
    "Please add it to your .env file (NOT as NEXT_PUBLIC_*)."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Get a configured Gemini model for chat/generation
 */
export function getGeminiModel(modelName: string = "gemini-2.0-flash-lite") {
  return genAI.getGenerativeModel({ model: modelName });
}

/**
 * Get a configured Gemini model with safety settings for chat
 */
export function getGeminiChatModel() {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  return { model, generationConfig, safetySettings };
}

/**
 * Start a chat session with the Gemini model
 */
export function startGeminiChat() {
  const { model, generationConfig, safetySettings } = getGeminiChatModel();
  return model.startChat({
    generationConfig,
    safetySettings,
  });
}

/**
 * Get the raw GoogleGenerativeAI instance for advanced use cases
 */
export function getGeminiClient() {
  return genAI;
}
