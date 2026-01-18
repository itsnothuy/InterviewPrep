"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { File, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import NewChatModal from "./NewChatModal";
import { DrizzleChat } from "@/utils/schema";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {
  const [loading, setLoading] = React.useState(false);
  // PERF-006 FIX: Add pagination to prevent memory issues with many chats
  const [page, setPage] = useState(1);
  const CHATS_PER_PAGE = 20;
  
  const { displayedChats, totalPages, hasMore } = useMemo(() => {
    const startIndex = 0;
    const endIndex = page * CHATS_PER_PAGE;
    return {
      displayedChats: chats.slice(startIndex, endIndex),
      totalPages: Math.ceil(chats.length / CHATS_PER_PAGE),
      hasMore: endIndex < chats.length,
    };
  }, [chats, page]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="w-full min-h-screen p-4 text-gray-200 bg-neutral-900">
      <NewChatModal />
      <div className="flex max-h-screen overflow-y-auto pb-20 flex-col gap-2 mt-4">
        {/* PERF-006 FIX: Display paginated chats */}
        {displayedChats.map((chat) => (
          <Link 
            key={chat.id} 
            href={`/chat/${chat.id}`}
            aria-label={`Open chat for ${chat.pdfName}`}
            aria-current={chat.id === chatId ? "page" : undefined}
          >
            <div
              className={cn("rounded-lg p-3 text-black flex items-center", {
                "bg-[#343541]": chat.id === chatId,
                "hover:bg-[#2D2F36]": chat.id !== chatId,
              })}
            >
              <File className="mr-2" color="white" aria-hidden="true" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis text-gray-200">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
        {/* PERF-006 FIX: Load more button for pagination */}
        {hasMore && (
          <Button
            onClick={loadMore}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-[#2D2F36] mt-2"
          >
            Load More ({chats.length - displayedChats.length} more)
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;
