import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);

export async function getEmbeddings(text: string) {
  try {
    // Ensure text is valid and not empty
    if (!text || typeof text !== 'string') {
      console.warn("getEmbeddings received invalid text:", text);
      text = "";
    }
    
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
