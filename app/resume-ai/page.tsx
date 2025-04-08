// app/resume-ai/page.tsx

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/app/FileUpload";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import LoginButton from "./LoginButton";

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
    <div className="w-screen min-h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Resume AI
          </h1>
          <p className="mt-1 text-lg text-slate-500">
            Upload your resume and let AI analyze and optimize it for your career growth.
          </p>
          <div className="flex mt-5">
            {!session ? (
              // Render the client LoginButton if no session exists
              <LoginButton />
            ) : (
              // If user is logged in, show a "Go to Chats" button (using the first chat record)
              <Link href={`/chat/${firstChat?.id}`}>
                <Button variant="dashboardAiOrHuman" className="flex gap-1">Go to Chats &rarr;</Button>
              </Link>
            )}
          </div>
          <div className="w-full mt-4">
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
