// app/resume-ai/page.tsx

// import { Button } from "@/components/ui/button";
// import { FileUpload } from "@/components/chat/FileUpload";
// import { getServerSession } from "next-auth";
// import { authConfig } from "@/lib/auth";
// import { db } from "@/utils/db";
// import { chats } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// import Link from "next/link";
// import LoginButton from "./LoginButton";

// export default async function ResumeAIPage() {
//   // Check for an active user session
//   const session = await getServerSession(authConfig);
//   let firstChat = null;

//   if (session) {
//     const chatRecords = await db
//       .select()
//       .from(chats)
//       .where(eq(chats.userId, session.user.id));
//     if (chatRecords && chatRecords.length > 0) {
//       firstChat = chatRecords[0];
//     }
//   }

//   return (
//     <div className="w-screen min-h-screen">
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//         <div className="flex flex-col items-center text-center">
//           <h1 className="text-6xl font-extrabold bg-hero-gradient bg-clip-text text-transparent">
//             Resume AI
//           </h1>
//           <p className="mt-1 text-lg text-muted">
//             Upload your resume and let AI analyze and optimize it for your career growth.
//           </p>
//           <div className="flex mt-5">
//             {!session ? (
//               // Render the client LoginButton if no session exists
//               <LoginButton />
//             ) : (
//               // If user is logged in, show a "Go to Chats" button (using the first chat record)
//               <Link href={`/chat/${firstChat?.id}`}>
//                 <Button variant="interviewCoder" className="rounded-md w-fit flex gap-1">Go to Chats &rarr;</Button>
//               </Link>
//             )}
//           </div>
//           <div className="w-full mt-4">
//             <FileUpload />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


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
