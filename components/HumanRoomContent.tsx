"use client";

import { useState } from "react";
import { HumanVideo } from "@/components/video-player";
import RoomDetails from "./RoomDetails";
import CodeEditorBlock from "@/components/code-editor-block";

interface Room {
  id: string;
  name: string;
  githubRepo?: string | null;
  description?: string | null;
  language?: string | null;
  pdfUrl?: string | null;
}

interface HumanRoomContentProps {
  room: Room;
}

export default function HumanRoomContent({ room }: HumanRoomContentProps) {
  const [showEditorModal, setShowEditorModal] = useState(false);

  return (
    <div className="grid grid-cols-4 min-h-screen">
      {/* Left Section: Video */}
      <div className="col-span-3 p-4 pr-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-h-screen">
          <HumanVideo room={room} />
        </div>
      </div>

      {/* Right Section: Room Details */}
      <RoomDetails room={room} onShowEditor={() => setShowEditorModal(true)} />

      {/* Conditionally Render the Code Editor */}
      {showEditorModal && (
        <div className="col-span-4 p-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
            <CodeEditorBlock />
          </div>
        </div>
      )}
    </div>
  );
}
