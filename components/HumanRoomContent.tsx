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

  return (
    <div className="min-h-screen relative">
       {/* Toggle Mode Button */}
       <div className="p-4">
        <Button onClick={toggleMode} variant="outline">
          {isFloatingMode ? "Go back" : "Show Code Editor"}
        </Button>
      </div>
      {!isFloatingMode ? (
        // Grid Mode: Video on left, room details on right, optional code editor below.
        <div className="grid grid-cols-4 min-h-screen">
          {/* Left Section: Video */}
          <div className="col-span-3 p-4 pr-2">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-h-screen">
              <HumanVideo room={room} />
            </div>
          </div>

          {/* Right Section: Room Details */}
          <RoomDetails room={room} onShowEditor={() => setShowEditor(true)} />

          {/* Conditionally Render the Code Editor */}
          {showEditor && (
            <div className="col-span-4 p-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                <CodeEditorBlock />
              </div>
            </div>
          )}
        </div>
      ): (
        // Floating Mode: Code Editor fills the main area; video appears as a small floating block.
        <div className="relative min-h-screen border bg-white">
          {/* Main Content: Code Editor */}
          <div className="p-4">
            <div className="rounded-lg bg-card text-card-foreground shadow-sm p-4">
              <CodeEditorBlock />
            </div>
          </div>
          {/* Floating Video Block */}
          <div className="fixed bottom-4 right-4 w-80 h-48 rounded-lg border bg-white shadow-lg overflow-hidden">
            <HumanVideo room={room} />
          </div>
        </div>
      )}
    </div>
  );
}
