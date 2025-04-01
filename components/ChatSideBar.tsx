"use client";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
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

  return (
    <div className="w-full min-h-screen p-4 text-gray-200 bg-neutral-900">
      {/* <Link href="/">
        <Button className="w-full border-dashed border-white border bg-orange-300 text-black">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link> */}
      <NewChatModal />


      <div className="flex max-h-screen overflow-y-auto pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-black flex items-center", {
                "bg-[#343541]": chat.id === chatId,
                "hover:bg-[#2D2F36]": chat.id !== chatId,
              })}
            >
              <File className="mr-2" color="white"/>
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis text-gray-200">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatSideBar;
