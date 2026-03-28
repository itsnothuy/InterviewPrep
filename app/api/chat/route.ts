import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { getContext } from "@/app/context";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { streamGenerate } from "@/lib/server/ollama";

// Keep old import for fallback (commented out)
// import { GoogleGenAI } from "@google/genai";

// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:70b";

interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { messages, chatId } = await req.json();
    console.log("Received request - chatId:", chatId, "messages:", messages);

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages);
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    
    if (_chats[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const fileKey = _chats[0].fileKey;

    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage?.parts?.find((part: any) => part.type === "text")?.text || lastMessage?.content || "";
    const context1 = await getContext(messageText, fileKey);

    const systemContent = `
AI assistant is a brand new, powerful, human-like artificial intelligence.
Traits: expert knowledge, helpfulness, cleverness, articulateness; friendly, kind, inspiring.
START CONTEXT BLOCK
${context1}
END OF CONTEXT BLOCK
The assistant will consider any CONTEXT BLOCK provided. It will not apologize for previous responses but will indicate when new information was gained.
    `.trim();

    const validMessages = messages.filter((msg: any) => msg && msg.role);
    console.log("Processing messages:", validMessages);

    // Convert messages to Ollama format
    const ollamaMessages: OllamaChatMessage[] = [
      {
        role: "system",
        content: systemContent,
      },
    ];

    // Add conversation history
    for (const msg of validMessages) {
      if (msg.role === "system") continue;
      
      const content = msg.parts?.find((part: any) => part.type === "text")?.text || msg.content || "";
      ollamaMessages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: content,
      });
    }

    // Use Ollama streaming
    const stream = await streamGenerate(ollamaMessages, OLLAMA_MODEL);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Check if Ollama is not running
    if (error instanceof Error && error.message.includes("fetch failed")) {
      console.error("Ollama may not be running. Start it with: ollama serve");
      return NextResponse.json(
        { error: "AI service unavailable. Please ensure Ollama is running." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
