"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Room } from "@/utils/schema";
import { GithubIcon, File } from "lucide-react";
import { LanguagesList } from "@/components/code-editor/languages-list";
import { splitLanguages } from "@/lib/utils";
import { useState } from "react";
import PDFViewer from "@/components/chat/PDFViewer";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
    const [showResume, setShowResume] = useState(false);

    // Helper function to truncate text to a maximum length with ellipsis in the middle.
    const truncate = (text: string | null, maxLength: number) => {
        if (text === null) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    // Extract the repository path from the URL and then truncate if necessary.
  const getShortRepoName = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      let repoPath = parsedUrl.pathname;
      if (repoPath.startsWith("/")) {
        repoPath = repoPath.substring(1);
      }
      return truncate(repoPath, 15);
    } catch (err) {
      return url;
    }
  };
  return (
    <>
        <Card>
            <CardHeader>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{truncate(room.description, 28)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <LanguagesList languages={splitLanguages(room?.language || "")} />
                {room.githubRepo && (
                <Link
                    href={`${room.githubRepo}`}
                    className="flex items-center gap-2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <GithubIcon />
                    {getShortRepoName(room.githubRepo)}
                </Link>
                )}
            </CardContent>
            <CardFooter>
                <Button variant={"dashboardAiOrHuman"} asChild>
                    <Link href={`/human-rooms/${room.id}`}>Join Room</Link>
                </Button>
                {room.pdfUrl && (
                    <button onClick={() => setShowResume(true)} className="p-2">
                        <File className="w-6 h-6" />
                        
                    </button>
                )}
            </CardFooter>
        </Card>
        {showResume && room.pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 h-3/4 relative">
            <Button
              onClick={() => setShowResume(false)}
              className="absolute top-3 left-2 p-3"
              variant={"dashboard"}
            >
              Close
            </Button>
            <PDFViewer pdf_url={room.pdfUrl} />
          </div>
        </div>
      )}
    </>
  );
}
