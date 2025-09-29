"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { type UIMessage } from "@ai-sdk/react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MessageList from "./Message";

type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<UIMessage[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Set initial messages when data loads
  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    
    const userMessage: UIMessage = {
      id: Date.now().toString(),
      role: "user",
      parts: [{ type: "text", text: input }],
    };
    
    // Add user message to UI immediately
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);
    
    try {
      // Send request to chat API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          chatId,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
      
      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      // Create assistant message
      const assistantMessage: UIMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        parts: [{ type: "text", text: "" }],
      };
      
      setMessages([...newMessages, assistantMessage]);
      
      if (reader) {
        let assistantContent = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          assistantContent += chunk;
          
          // Update the assistant message with accumulated content
          setMessages(prevMessages => {
            const updatedMessages = [...prevMessages];
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.parts = [{ type: "text", text: assistantContent }];
            }
            return updatedMessages;
          });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
      <div className="sticky top-0 inset-x-0 p-2 bg-[#2D2F36] h-fit mb-2">
        <h3 className="text-xl font-bold text-gray-300">Chat</h3>
      </div>

      {/* message list */}
      <div className="flex-grow relative overflow-y-auto hide-scrollbar">
        {/* Placeholder message shown when there are no messages */}
        {!isLoading && messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1 className="text-white text-3xl font-bold items-center justify-center">
            What can I help you with?
            </h1>
            <p>
              <span className="text-gray-400 items-center justify-center">
                Type your question in the input below.
              </span>
            </p>
          </div>
        )}
        <MessageList messages={messages} isLoading={isGenerating} />
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
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
