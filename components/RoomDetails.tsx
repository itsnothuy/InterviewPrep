"use client";

import { useState } from "react";
import Link from "next/link";
import { GithubIcon, File } from "lucide-react";
import { LanguagesList } from "@/components/languages-list";
import { splitLanguages } from "@/lib/utils";
import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";

interface Room {
  name: string;
  githubRepo?: string | null;
  description?: string | null;
  language?: string | null;
  pdfUrl?: string | null;
}

interface RoomDetailsProps {
  room: Room;
}

export default function RoomDetails({ room }: RoomDetailsProps) {
  const [showResume, setShowResume] = useState(false);

  // Helper function to truncate text to a maximum length with ellipsis.
  const truncate = (text: string | null, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Helper function to extract and shorten the GitHub repository path.
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
      <div className="col-span-1 p-4 pl-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-4">
          <h1 className="text-base">{room?.name}</h1>
          {room.githubRepo && (
            <Link
              href={room.githubRepo}
              className="flex items-center gap-2 text-center text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon />
              {getShortRepoName(room.githubRepo)}
            </Link>
          )}
          <LanguagesList languages={splitLanguages(room?.language || "")} />
          {/* PDF Icon Button: only show if pdfUrl exists */}
          {room.pdfUrl && (
            <button onClick={() => setShowResume(true)} className="self-start flex mb-1">
              <File className="w-6 h-6" />
              <span className="ml-2">Resume</span>
            </button>
          )}
        </div>
      </div>

      {showResume && room.pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 h-3/4 relative">
            <Button
              onClick={() => setShowResume(false)}
              className="absolute top-2 left-2 p-2"
              variant={"dashboard"}
            >
              Close
            </Button>
            <PDFViewer pdf_url={room.pdfUrl || ""} />
          </div>
        </div>
      )}
    </>
  );
}
