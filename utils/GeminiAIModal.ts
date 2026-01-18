import { GoogleGenAI } from "@google/genai";

const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
const genAI = new GoogleGenAI({ apiKey });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

// Export function to generate content
export async function generateChatResponse(prompt: string, modelName: string = "gemini-2.0-flash-lite") {
  const response = await genAI.models.generateContent({
    model: modelName,
    contents: prompt,
    config: generationConfig
  });
  return response;
}

// Backwards compatible chat session object
// Mimics the old API for existing code
export const chatSession = {
  async sendMessage(prompt: string) {
    const response = await generateChatResponse(prompt);
    // Return object that mimics old API structure
    return {
      response: {
        text: () => response.text || ""
      }
    };
  }
};
