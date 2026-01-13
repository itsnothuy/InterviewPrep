import { db } from "@/lib/server/db";
import { messages, chats } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse, 
  serverErrorResponse,
  forbiddenResponse 
} from "@/lib/server/auth";

const requestSchema = z.object({
  chatId: z.number().int().positive(),
});

export const POST = async (req: Request) => {
  try {
    const session = await requireAuth();
    
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid chatId");
    }
    
    const { chatId } = parsed.data;
    
    // Verify the chat belongs to this user (BOLA protection)
    const chat = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))
      .limit(1);
    
    if (chat.length === 0) {
      return forbiddenResponse("Chat not found or access denied");
    }
    
    // Now safely fetch messages for this chat
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId));
      
    return NextResponse.json(_messages);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error fetching messages:", error);
    return serverErrorResponse();
  }
};
