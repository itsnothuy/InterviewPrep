/**
 * LLM Generate API Route
 * 
 * This API route handles text generation requests and forwards them to Ollama.
 * It acts as a proxy so that the client-side code doesn't directly access Ollama.
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:70b";

interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function POST(req: Request) {
  try {
    // Optional: Add authentication check
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { prompt, temperature = 0.7, maxTokens } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt" },
        { status: 400 }
      );
    }

    // Call Ollama
    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: temperature,
          top_p: 0.95,
          top_k: 64,
          ...(maxTokens && { num_predict: maxTokens }),
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error("Ollama error:", errorText);
      return NextResponse.json(
        { error: "LLM generation failed" },
        { status: 500 }
      );
    }

    const data: OllamaGenerateResponse = await ollamaResponse.json();

    return NextResponse.json({
      text: data.response,
      model: data.model,
    });
  } catch (error) {
    console.error("LLM Generate API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
