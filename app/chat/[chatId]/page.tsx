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
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/resume-ai");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/resume-ai");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  return (
    <div className="flex w-full overflow-scroll hide-scrollbar bg-black" style={{ height: "calc(100vh - 80px)" }}>
      <div className="flex w-full h-full overflow-scroll hide-scrollbar">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs h-full">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="h-full oveflow-scroll flex-[5]">
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
