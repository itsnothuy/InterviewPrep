import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/chat/FileUpload";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import LoginButton from "./LoginButton";
import ResumeAIContent from "./ResumeAIContent";

export default async function ResumeAIPage() {
  // Check for an active user session
  const session = await getServerSession(authConfig);
  let firstChat = null;

  if (session) {
    const chatRecords = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, session.user.id));
    if (chatRecords && chatRecords.length > 0) {
      firstChat = chatRecords[0];
    }
  }

  return (
    <ResumeAIContent session={session} firstChat={firstChat} />
  );
}
