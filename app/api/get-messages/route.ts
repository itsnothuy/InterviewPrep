import { db } from "@/utils/db";
import { messages, chats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";


export const POST = async (req: Request) => {
  // SEC-004 FIX: Add authentication check
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { chatId } = await req.json();
  
  // SEC-001 FIX: Verify chat ownership to prevent IDOR
  const chatOwner = await db.select({ userId: chats.userId })
    .from(chats)
    .where(eq(chats.id, chatId))
    .limit(1);
    
  if (chatOwner.length === 0 || chatOwner[0].userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));
  return NextResponse.json(_messages);
};
