import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

/**
 * GET /api/get-chats
 * 
 * Returns all chats for the authenticated user.
 * Used by resume-ai page to get first chat for "Go to Chats" button.
 * 
 * Created: January 16, 2026
 * Reason: resume-ai page converted to client component for motion animation
 */
export async function GET() {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, session.user.id));

    return NextResponse.json(userChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
