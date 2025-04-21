// components/NewChatModal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/chat/FileUpload";
import { MessageCircle, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function NewChatModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full border-dashed border-white border bg-[#40414F] text-gray-200 hover:bg-gray-500/90">
        <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Chat</DialogTitle>
        </DialogHeader>
        {/* FileUpload should implement your PDF upload & chat creation logic */}
        <FileUpload />
      </DialogContent>
    </Dialog>
  );
}
