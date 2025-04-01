import { Button } from "@/components/ui/button";
import { FileUpload } from "../FileUpload";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ChevronLast } from "lucide-react";

export default async function ChatPDFPage() {
  const session = await getServerSession(authConfig);
  let firstChat;
  if (session) {
    firstChat = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, session?.user?.id));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 p-4 text-6xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Chat with any PDF
            </h1>
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-500">
            Join milions of students to instantly answer questions and
            understand your own PDF files with Interview Expert
          </p>
          <div className="flex mt-5">
            {session && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button className="flex gap-1">Go to chats &rarr;</Button>
                </Link>
              </>
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
