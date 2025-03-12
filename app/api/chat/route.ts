import {
  GoogleGenerativeAIStream,
  Message,
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { chats, messages as _message } from "@/utils/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getContext } from "@/app/context";

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    //get file _key from chatId
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context1 = await getContext(lastMessage.content, fileKey);

    const context = buildGoogleGenAIPrompt(messages);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context1}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      `,
    };

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: prompt.content,
    });
    const streamingResponse = await model.generateContentStream(context);
    return new StreamingTextResponse(
      GoogleGenerativeAIStream(streamingResponse)
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

function buildGoogleGenAIPrompt(messages: Message[]) {
  return {
    contents: messages
      .filter((message) => message.role === "user" || message.role === "system")
      .map((message) => ({
        role: message.role === "user" ? "user" : "system",
        parts: [{ text: message.content }],
      })),
  };
}
