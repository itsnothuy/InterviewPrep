import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { getContext } from "@/app/context";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

import { GoogleGenerativeAI } from "@google/generative-ai";

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // SEC-005 FIX: Add authentication check
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { messages, chatId } = await req.json();
    
    // Debug logging
    console.log("Received request - chatId:", chatId, "messages:", messages);

    // Validate that messages is an array
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages);
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    // fetch chat & file key
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    
    // SEC-001 FIX: Verify chat ownership to prevent IDOR
    if (_chats[0].userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const fileKey = _chats[0].fileKey;

    // retrieve semantic context for the last user turn
    const lastMessage = messages[messages.length - 1];
    const messageText = lastMessage?.parts?.find((part: any) => part.type === "text")?.text || lastMessage?.content || "";
    const context1 = await getContext(messageText, fileKey);

    // Build system + user messages for AI SDK
    const systemContent = `
AI assistant is a brand new, powerful, human-like artificial intelligence.
Traits: expert knowledge, helpfulness, cleverness, articulateness; friendly, kind, inspiring.
Big fan of Pinecone and Vercel.
START CONTEXT BLOCK
${context1}
END OF CONTEXT BLOCK
The assistant will consider any CONTEXT BLOCK provided. It will not apologize for previous responses but will indicate when new information was gained.
    `.trim();

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" }, { apiVersion: 'v1beta' });

    // Convert messages to Google AI format
    const validMessages = messages.filter((msg: any) => msg && msg.role);
    console.log("Processing messages:", validMessages);

    // Build conversation history for Google AI
    // Add system instruction as first user message, followed by a model response acknowledging it
    const systemHistory = [
      {
        role: "user",
        parts: [{ text: systemContent }]
      },
      {
        role: "model", 
        parts: [{ text: "I understand. I am an AI assistant with expert knowledge, helpfulness, cleverness, and articulateness. I'm friendly, kind, and inspiring. I'll consider any context provided and indicate when new information is gained without apologizing for previous responses." }]
      }
    ];

    const messageHistory = validMessages
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.parts?.find((part: any) => part.type === "text")?.text || msg.content || "" }]
      }));

    // Combine system history with message history, excluding the last message
    const fullHistory = [...systemHistory, ...messageHistory.slice(0, -1)];

    // Start chat with full history
    const chat = model.startChat({
      history: fullHistory
    });

    // Get the last user message
    const lastUserMessage = validMessages[validMessages.length - 1];
    const userInput = lastUserMessage.parts?.find((part: any) => part.type === "text")?.text || lastUserMessage.content || "";

    // Generate streaming response
    const result = await chat.sendMessageStream(userInput);

    // Create a ReadableStream for the response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // If it's a model not found error, provide helpful info
    if (error instanceof Error && error.message.includes("not found")) {
      console.log("Model not found. You can check available models at: https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY");
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
