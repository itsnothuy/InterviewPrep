import ChatComponent from "@/components/chat/ChatComponent";
import ChatSideBar from "@/components/chat/ChatSideBar";
import PDFViewer from "@/components/chat/PDFViewer";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  
  // SEC-002 FIX: Validate redirect paths to prevent open redirect
  const SAFE_REDIRECT_PATHS = ["/sign-in", "/resume-ai"];
  const validateRedirect = (path: string) => {
    if (!SAFE_REDIRECT_PATHS.includes(path)) {
      throw new Error(`Invalid redirect path: ${path}`);
    }
    return path;
  };
  
  if (!userId) {
    return redirect(validateRedirect("/sign-in"));
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats || _chats.length === 0) {
    return redirect(validateRedirect("/resume-ai"));
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect(validateRedirect("/resume-ai"));
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  return (
    <div className="flex w-full overflow-scroll hide-scrollbar bg-bg pt-10 mt-8" style={{ height: "calc(100vh - 50px)" }}>
      <div className="flex w-full h-full overflow-scroll hide-scrollbar">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs h-full">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="h-full flex-[6]">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] ">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
