import { GoogleGenAI } from "@google/genai";

// Access your API key as an environment variable
const genAI = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string 
});

export async function getEmbeddings(text: string) {
  try {
    // Ensure text is valid and not empty
    if (!text || typeof text !== 'string') {
      console.warn("getEmbeddings received invalid text:", text);
      text = "";
    }
    
    // For embeddings, use the Text Embeddings model
    const response = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: text.replace(/\n/g, " "),
    });
    
    return response.embeddings?.[0]?.values || [];
  } catch (error) {
    console.error("Error generating embedding from Gemini:", error);
    throw error;
  }
}
