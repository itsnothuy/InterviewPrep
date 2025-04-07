"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HumanVideo } from "@/components/video-player";
import RoomDetails from "./RoomDetails";
import CodeEditorBlock from "@/components/code-editor-block";
import { Room as RoomType } from "@/utils/schema"; // Import the Room type from your schema


interface Room {
  id: string;
  name: string;
  githubRepo?: string | null;
  description?: string | null;
  language?: string | null;
  pdfUrl?: string | null;
}

interface HumanRoomContentProps {
  room: RoomType;
}

export default function HumanRoomContent({ room }: HumanRoomContentProps) {
  const [showEditor, setShowEditor] = useState(false);

  const [isFloatingMode, setIsFloatingMode] = useState(false);

  const toggleMode = () => {
    setIsFloatingMode((prev) => !prev);
  };

  const videoWrapperClass = isFloatingMode
    ? "fixed bottom-4 right-4 w-80 h-48 z-40"
    : "w-3/4 p-4 pr-2";
  const videoInnerClass = isFloatingMode
    ? "rounded-lg border bg-white shadow-lg overflow-hidden h-full"
    : "rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-h-[400px]";

  return (
    <div className="min-h-screen relative">
       {/* Toggle Mode Button */}
       <div className="pt-4 pl-4">
        <Button onClick={toggleMode} variant="outline">
          {isFloatingMode ? "Go back" : "Show Code Editor"}
        </Button>
      </div>
      <div className="flex min-h-screen">
        {/* Video Section: Always rendered */}
        <div className={videoWrapperClass}>
          <div className={videoInnerClass}>
            <HumanVideo room={room} />
          </div>
        </div>

        {/* Room Details shown only in Grid Mode */}
        {!isFloatingMode && (
          <div className="w-1/4 p-4 pl-2">
            <RoomDetails room={room} />
          </div>
        )}
      </div>

      {/* Code Editor always rendered below */}
      <div className="p-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <CodeEditorBlock />
        </div>
      </div>
    </div>
  );
}
