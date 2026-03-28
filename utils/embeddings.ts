/**
 * Embeddings Utility - Using Ollama with nomic-embed-text
 * 
 * Replaces Google's text-embedding-004 with Ollama's nomic-embed-text.
 * Both produce 768-dimensional vectors, so Pinecone index remains compatible.
 */

// Keep old import for reference/fallback (commented out)
// import { GoogleGenAI } from "@google/genai";
// const genAI = new GoogleGenAI({ 
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string 
// });

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

interface OllamaEmbeddingResponse {
  embedding: number[];
}

export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    // Ensure text is valid and not empty
    if (!text || typeof text !== 'string') {
      console.warn("getEmbeddings received invalid text:", text);
      text = "";
    }

    // Clean text: remove excessive newlines
    const cleanedText = text.replace(/\n/g, " ").trim();

    if (!cleanedText) {
      console.warn("getEmbeddings received empty text after cleaning");
      // Return zero vector of correct dimension (768 for nomic-embed-text)
      return new Array(768).fill(0);
    }

    // Call Ollama embeddings API
    const response = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_EMBEDDING_MODEL,
        prompt: cleanedText,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama embedding failed: ${response.status} - ${errorText}`);
    }

    const data: OllamaEmbeddingResponse = await response.json();

    if (!data.embedding || !Array.isArray(data.embedding)) {
      throw new Error("Invalid embedding response from Ollama");
    }

    return data.embedding;
  } catch (error) {
    console.error("Error generating embedding from Ollama:", error);
    
    // Check if Ollama is not running
    if (error instanceof Error && error.message.includes("fetch failed")) {
      console.error("Ollama may not be running. Start it with: ollama serve");
      console.error("Then pull the embedding model: ollama pull nomic-embed-text");
    }
    
    throw error;
  }
}

