// UX-007 FIX: Delete chat confirmation dialog
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  chatId: number;
  chatName: string;
  onDelete: (chatId: number) => void;
};

export function DeleteChatDialog({ chatId, chatName, onDelete }: Props) {
  const t = useTranslations('sidebar.deleteConfirm');
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-chat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete chat");
      }
      
      setOpen(false);
      onDelete(chatId);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
            "hover:bg-red-500/20 text-gray-400 hover:text-red-400"
          )}
          aria-label={`Delete chat ${chatName}`}
          onClick={(e) => {
            e.preventDefault(); // Prevent Link navigation
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-neutral-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {t('description', { name: chatName })}
            <br />
            <span className="text-red-400 text-sm mt-2 block">
              {t('warning')}
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteChatDialog;
