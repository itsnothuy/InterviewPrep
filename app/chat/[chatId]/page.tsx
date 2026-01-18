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
import { Metadata } from "next";

type Props = {
  params: {
    chatId: string;
  };
};

// SEO-001 FIX: Add page-specific metadata for better SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await getServerSession(authConfig);
  const userId = session?.user?.id;
  
  if (!userId) {
    return {
      title: "Chat - Sign In Required",
      robots: "noindex, nofollow",
    };
  }
  
  try {
    const chat = await db.select()
      .from(chats)
      .where(eq(chats.id, parseInt(params.chatId)))
      .limit(1);
    
    if (chat[0] && chat[0].userId === userId) {
      const title = `Chat: ${chat[0].pdfName || "Resume Chat"}`;
      const description = "AI-powered resume analysis and chat";
      
      return {
        title,
        description,
        robots: "noindex, nofollow", // Private content
        // SEO-002 FIX: OpenGraph tags for social sharing
        openGraph: {
          title,
          description,
          type: "website",
          siteName: "InterviewPrep AI",
        },
        // SEO-002 FIX: Twitter Card metadata
        twitter: {
          card: "summary",
          title,
          description,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
  
  return {
    title: "Resume AI Chat",
    description: "AI-powered resume analysis",
    robots: "noindex, nofollow",
  };
}

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
  
  // PERF-003 FIX: Single optimized query instead of two sequential queries
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  
  if (!_chats || _chats.length === 0) {
    return redirect(validateRedirect("/resume-ai"));
  }
  
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  
  if (!currentChat) {
    return redirect(validateRedirect("/resume-ai"));
  }
  return (
    <div className="flex w-full bg-bg pt-10 mt-8" style={{ height: "calc(100vh - 50px)" }}>
      <div className="flex w-full h-full">
        {/* chat sidebar - Independent scrolling */}
        <div className="flex-[1] max-w-xs h-full overflow-y-auto hide-scrollbar">
          <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer - Independent scrolling */}
        <div className="h-full flex-[6] overflow-y-auto hide-scrollbar">
          <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        </div>
        {/* chat component - Independent scrolling */}
        <div className="flex-[3] overflow-y-auto hide-scrollbar">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
