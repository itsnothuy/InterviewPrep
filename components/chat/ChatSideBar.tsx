"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { File, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import NewChatModal from "./NewChatModal";
import { DrizzleChat } from "@/utils/schema";
import { DeleteChatDialog } from "./DeleteChatDialog";
import { useTranslations } from "next-intl";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats: initialChats, chatId }: Props) => {
  const t = useTranslations('sidebar');
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  // UX-007 FIX: Track local chat list for optimistic UI updates
  const [chatList, setChatList] = useState(initialChats);
  // PERF-006 FIX: Add pagination to prevent memory issues with many chats
  const [page, setPage] = useState(1);
  const CHATS_PER_PAGE = 20;
  
  const { displayedChats, totalPages, hasMore } = useMemo(() => {
    const startIndex = 0;
    const endIndex = page * CHATS_PER_PAGE;
    return {
      displayedChats: chatList.slice(startIndex, endIndex),
      totalPages: Math.ceil(chatList.length / CHATS_PER_PAGE),
      hasMore: endIndex < chatList.length,
    };
  }, [chatList, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  // UX-007 FIX: Handle chat deletion
  const handleDeleteChat = (deletedChatId: number) => {
    // Remove from local state (optimistic update)
    setChatList(prev => prev.filter(chat => chat.id !== deletedChatId));
    
    // If deleted chat was the active one, navigate to another chat or resume-ai
    if (deletedChatId === chatId) {
      const remainingChats = chatList.filter(chat => chat.id !== deletedChatId);
      if (remainingChats.length > 0) {
        router.push(`/chat/${remainingChats[0].id}`);
      } else {
        router.push("/resume-ai");
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-4 text-gray-200 bg-neutral-900">
      <NewChatModal />
      <div className="flex max-h-screen overflow-y-auto pb-20 flex-col gap-2 mt-4">
        {/* PERF-006 FIX: Display paginated chats */}
        {displayedChats.map((chat) => (
          <div key={chat.id} className="group relative">
            <Link 
              href={`/chat/${chat.id}`}
              aria-label={t('openChat', { name: chat.pdfName })}
              aria-current={chat.id === chatId ? "page" : undefined}
            >
              <div
                className={cn("rounded-lg p-3 text-black flex items-center pr-5", {
                  "bg-[#343541]": chat.id === chatId,
                  "hover:bg-[#2D2F36]": chat.id !== chatId,
                })}
              >
                <File className="mr-2 flex-shrink-0" color="white" aria-hidden="true" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis text-gray-200">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
            {/* UX-007 FIX: Delete button with confirmation dialog */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <DeleteChatDialog 
                chatId={chat.id} 
                chatName={chat.pdfName} 
                onDelete={handleDeleteChat}
              />
            </div>
          </div>
        ))}
        {/* PERF-006 FIX: Load more button for pagination */}
        {hasMore && (
          <Button
            onClick={loadMore}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-[#2D2F36] mt-2"
          >
            {t('loadMore', { count: chatList.length - displayedChats.length })}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
