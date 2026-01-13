import "server-only";

import { getGeminiClient } from "@/lib/server/gemini";
import { GenerativeModel } from "@google/generative-ai";

export async function getEmbeddings(text: string) {
  try {
    // Ensure text is valid and not empty
    if (!text || typeof text !== 'string') {
      console.warn("getEmbeddings received invalid text:", text);
      text = "";
    }
    
    const genAI = getGeminiClient();
    // For embeddings, use the Text Embeddings model
    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });
    const result = await model.embedContent(text.replace(/\n/g, " "));
    const embedding = result.embedding;
    return embedding.values;
  } catch (error) {
    console.error("Error generating embedding from Gemini:", error);
    throw error;
  }
}

