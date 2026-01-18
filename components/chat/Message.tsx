import { cn } from "@/lib/utils";
import { type UIMessage } from "@ai-sdk/react";
import { Loader2, User2, Bot, Copy, Check } from "lucide-react";
import React, { useState, useMemo } from "react";
import Markdown from "./Markdown";
import { Virtuoso } from "react-virtuoso";

type Props = {
  isLoading: boolean;
  messages: UIMessage[];
};

// PERF-002 FIX: Threshold for virtualization - only virtualize for long conversations
const VIRTUALIZATION_THRESHOLD = 50;

const MessageList = ({ messages, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }
  if (!messages) return <></>;
  
  // PERF-002 FIX: Use virtualization for long message lists (>50 messages)
  const shouldVirtualize = messages.length > VIRTUALIZATION_THRESHOLD;
  
  if (shouldVirtualize) {
    return (
      <Virtuoso
        style={{ height: "100%" }}
        data={messages}
        itemContent={(index, message) => (
          <MessageItem key={message.id} message={message} />
        )}
        className="px-4"
        // PERF-002: Start at bottom for chat-like behavior
        initialTopMostItemIndex={messages.length - 1}
        followOutput="smooth"
        // A11Y-009: Maintain accessibility
        role="list"
        aria-label="Chat messages"
      />
    );
  }
  
  // A11Y-009 FIX: Use semantic list structure for messages (short lists)
  return (
    <ul className="flex flex-col gap-2 px-4" role="list">
      {messages.map((message, index) => {
        return (
          <MessageItem key={message.id} message={message} />
        );
      })}
    </ul>
  );
};

// UX-005 & UX-006 FIX: Extract message item with timestamp and copy functionality
const MessageItem = ({ message }: { message: UIMessage }) => {
  const [copied, setCopied] = useState(false);
  
  const messageText = message.parts?.find(part => part.type === "text")?.text || "";
  
  // UX-006 FIX: Copy message to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // UX-005 FIX: Format timestamp
  const getTimestamp = () => {
    try {
      const timestamp = parseInt(message.id);
      if (isNaN(timestamp)) return null;
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return null;
    }
  };
  
  const timestamp = getTimestamp();
  
  return (
    <li
      className={cn("flex group", {
        "justify-end pl-10": message.role === "user",
        "justify-start pr-10": message.role === "assistant",
      })}
    >
      <div className="flex flex-col gap-1 max-w-full">
        <div
          className={cn(
            "rounded-lg px-3 text-sm py-1 ring-1 ring-gray-500/20 relative",
            {
              "bg-gray-600 text-white": message.role === "user",
              "bg-[#40414F] text-white ring-0": message.role === "assistant",
            }
          )}
        >
          <Markdown text={messageText} />
          {/* UX-006 FIX: Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              "absolute top-1 right-1 p-1 rounded",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-white/10"
            )}
            aria-label="Copy message"
            title="Copy message"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3 text-gray-400" />
            )}
          </button>
        </div>
        {/* UX-005 FIX: Timestamp */}
        {timestamp && (
          <span className={cn(
            "text-xs text-gray-500 px-1",
            message.role === "user" ? "text-right" : "text-left"
          )}>
            {timestamp}
          </span>
        )}
      </div>
    </li>
  );
};

export default MessageList;
