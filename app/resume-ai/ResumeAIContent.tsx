"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/chat/FileUpload";
import Link from "next/link";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import LoginButton from "./LoginButton";

interface ResumeAIContentProps {
  session: Session | null;
  firstChat: { id: number } | null;
}

export default function ResumeAIContent({ session, firstChat }: ResumeAIContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-screen min-h-screen"
    >
      {/* Background layer with animated GIF */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/code-matrix.gif')",
            backgroundSize: "cover",
          }}
        />
      </div>
      
      {/* Content layer with higher z-index */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl font-extrabold bg-hero-gradient bg-clip-text text-transparent">
            Resume AI
          </h1>
          <p className="mt-4 text-lg text-text">
            Upload your resume and let AI analyze and optimize it for your career growth.
          </p>
          <div className="flex mt-5">
            {!session ? (
              <LoginButton />
            ) : (
              <Link href={`/chat/${firstChat?.id}`}>
                <Button variant="interviewCoder" className="rounded-md w-fit flex gap-1">
                  Go to Chats &rarr;
                </Button>
              </Link>
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
