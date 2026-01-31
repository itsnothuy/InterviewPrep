/**
 * Ollama Embeddings Utility
 * 
 * Replaces Google's text-embedding-004 with Ollama's nomic-embed-text
 * Both produce 768-dimensional vectors, so Pinecone index remains compatible.
 */

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

interface OllamaEmbeddingResponse {
  embedding: number[];
}

/**
 * Get embeddings for a text string using Ollama
 * 
 * @param text - The text to embed
 * @returns Array of numbers representing the embedding vector (768 dimensions)
 */
export async function getEmbeddings(text: string): Promise<number[]> {
  try {
    // Ensure text is valid and not empty
    if (!text || typeof text !== "string") {
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
    throw error;
  }
}

/**
 * Get embeddings for multiple texts (batch processing)
 * Note: Ollama doesn't natively support batch embeddings,
 * so we process them sequentially
 * 
 * @param texts - Array of texts to embed
 * @returns Array of embedding vectors
 */
export async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];

  for (const text of texts) {
    const embedding = await getEmbeddings(text);
    embeddings.push(embedding);
  }

  return embeddings;
}

/**
 * Check if Ollama embedding model is available
 */
export async function checkEmbeddingModelAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) return false;

    const data = await response.json();
    const models = data.models?.map((m: { name: string }) => m.name) || [];

    return models.some(
      (name: string) =>
        name.includes("nomic-embed") || name === OLLAMA_EMBEDDING_MODEL
    );
  } catch (error) {
    console.error("Error checking embedding model availability:", error);
    return false;
  }
}

/**
 * Get embedding model info
 */
export function getEmbeddingModelInfo() {
  return {
    model: OLLAMA_EMBEDDING_MODEL,
    dimensions: 768, // nomic-embed-text produces 768-dim vectors
    baseUrl: OLLAMA_BASE_URL,
  };
}
