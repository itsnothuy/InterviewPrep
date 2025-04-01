"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import MessageList from "./Message";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div
      className="flex flex-col h-screen bg-[#40414F] text-white"
      id="message-container"
    >
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-[#2D2F36] h-fit">
        <h3 className="text-xl font-bold text-gray-300">Chat</h3>
      </div>

      {/* message list */}
      <div className="flex-grow overflow-y-auto hide-scrollbar">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-2 bg-[#2D2F36]"
      >
        <div className="flex mt-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask anything..."
            className="w-full bg-[#40414F] text-white placeholder-gray-400 border-none"
          />
          <Button className="bg-[#40414F] ml-2 hover:bg-gray-500/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
