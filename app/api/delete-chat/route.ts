// UX-007 FIX: Delete chat API endpoint
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/utils/db";
import { chats, messages } from "@/utils/schema";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    // Authentication check
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { chatId } = await req.json();
    
    if (!chatId || typeof chatId !== "number") {
      return NextResponse.json({ error: "Invalid chatId" }, { status: 400 });
    }
    
    // Verify ownership before deletion
    const chatToDelete = await db.select()
      .from(chats)
      .where(and(
        eq(chats.id, chatId),
        eq(chats.userId, session.user.id)
      ))
      .limit(1);
    
    if (chatToDelete.length === 0) {
      return NextResponse.json({ error: "Chat not found or access denied" }, { status: 404 });
    }
    
    // Delete messages first (due to foreign key constraint)
    await db.delete(messages).where(eq(messages.chatId, chatId));
    
    // Delete the chat
    await db.delete(chats).where(eq(chats.id, chatId));
    
    // Note: S3 file cleanup could be done here or via a background job
    // For now, we're keeping the S3 files (they have their own lifecycle policies)
    
    return NextResponse.json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 }
    );
  }
}
