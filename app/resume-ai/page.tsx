"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/chat/FileUpload";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoginButton from "./LoginButton";

export default function ResumeAIPage() {
  const { data: session } = useSession();
  const [firstChatId, setFirstChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFirstChat() {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/get-chats');
          if (response.ok) {
            const chats = await response.json();
            if (chats && chats.length > 0) {
              setFirstChatId(chats[0].id);
            }
          }
        } catch (error) {
          console.error('Error fetching chats:', error);
        }
      }
      setIsLoading(false);
    }

    fetchFirstChat();
  }, [session]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-screen min-h-screen"
    >
      {/* Background layer with animated GIF */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/code-matrix.gif')",
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* Content layer with higher z-index */}
      <div className="relative z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl font-extrabold bg-hero-gradient bg-clip-text text-transparent">
            Resume AI
          </h1>
          <p className="mt-1 text-lg text-muted">
            Upload your resume and let AI analyze and optimize it for your career growth.
          </p>
          <div className="flex mt-5">
            {!session ? (
              <LoginButton />
            ) : isLoading ? (
              <Button variant="interviewCoder" className="rounded-md w-fit flex gap-1" disabled>
                Loading...
              </Button>
            ) : firstChatId ? (
              <Link href={`/chat/${firstChatId}`}>
                <Button variant="interviewCoder" className="rounded-md w-fit flex gap-1">
                  Go to Chats &rarr;
                </Button>
              </Link>
            ) : (
              <Button variant="interviewCoder" className="rounded-md w-fit flex gap-1" disabled>
                No chats available
              </Button>
            )}
          </div>
          <div className="w-full mt-4">
            <FileUpload />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
