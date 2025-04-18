import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { Loader2, User2, Bot } from "lucide-react";
import React from "react";
import Markdown from "./Markdown";

type Props = {
  isLoading: boolean;
  messages: Message[];
};

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message, index) => {
        return (
          <div
            key={message.id}
            className={cn("flex", {
              "justify-end pl-10": message.role === "user",
              "justify-start pr-10": message.role === "assistant",
            })}
          >
            <div
              className={cn(
                "rounded-lg px-3 text-sm py-1 ring-1 ring-gray-500/20",
                {
                  "bg-gray-600 text-white": message.role === "user",
                  "bg-[#40414F] text-white ring-0": message.role === "assistant",
                }
              )}
            >
              <Markdown text={message.content} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
