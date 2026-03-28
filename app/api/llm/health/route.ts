/**
 * LLM Health Check API Route
 * 
 * Checks if Ollama is running and the required models are available.
 */
import { NextResponse } from "next/server";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:70b";
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

export async function GET() {
  try {
    // Check if Ollama is running
    const tagsResponse = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
    });

    if (!tagsResponse.ok) {
      return NextResponse.json(
        {
          status: "unhealthy",
          error: "Ollama not responding",
          details: {
            ollamaUrl: OLLAMA_BASE_URL,
            responseStatus: tagsResponse.status,
          },
        },
        { status: 503 }
      );
    }

    const tagsData = await tagsResponse.json();
    const availableModels = tagsData.models?.map((m: { name: string }) => m.name) || [];

    // Check if required models are available
    const hasTextModel = availableModels.some(
      (name: string) => name.includes(OLLAMA_MODEL.split(":")[0])
    );
    const hasEmbeddingModel = availableModels.some(
      (name: string) => name.includes("nomic-embed")
    );

    const missingModels: string[] = [];
    if (!hasTextModel) missingModels.push(OLLAMA_MODEL);
    if (!hasEmbeddingModel) missingModels.push(OLLAMA_EMBEDDING_MODEL);

    if (missingModels.length > 0) {
      return NextResponse.json(
        {
          status: "degraded",
          message: "Some models are not available",
          missingModels,
          availableModels,
          suggestion: `Run: ollama pull ${missingModels.join(" && ollama pull ")}`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: "healthy",
      ollama: {
        url: OLLAMA_BASE_URL,
        textModel: OLLAMA_MODEL,
        embeddingModel: OLLAMA_EMBEDDING_MODEL,
      },
      availableModels,
    });
  } catch (error) {
    console.error("LLM Health Check Error:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Cannot connect to Ollama",
        details: {
          ollamaUrl: OLLAMA_BASE_URL,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        },
        suggestion: "Make sure Ollama is running: ollama serve",
      },
      { status: 503 }
    );
  }
}
