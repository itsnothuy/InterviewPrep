"use client";

import { useState } from "react";
import { HumanVideo } from "@/components/video-player";
import RoomDetails from "@/components/RoomDetails";
import CodeEditorBlock from "@/components/code-editor-block";
import { Room as RoomType } from "@/utils/schema";
import { Button } from "@/components/ui/button";

// Dummy room data for demonstration; replace with your actual data fetching logic.
const dummyRoom: RoomType = {
  id: "room1",
  name: "Sample Room",
  userId: "user1",
  createdAt: new Date(),
  description: "This is a sample room for demonstration purposes.",
  language: "javascript",
  githubRepo: "https://github.com/example/sample",
  pdfUrl: "https://your-s3-bucket-url/sample.pdf",
};

export default function HumanVideoFloatingPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [isFloatingMode, setIsFloatingMode] = useState(false);

  const toggleMode = () => {
    setIsFloatingMode((prev) => !prev);
  };

  // In a real application, fetch your room data here.
  const room: RoomType = dummyRoom;

  return (
    <div className="min-h-screen relative">
      {/* Toggle Mode Button */}
      <div className="p-4">
        <Button onClick={toggleMode} variant="outline">
          {isFloatingMode ? "Switch to Grid Mode" : "Switch to Floating Mode"}
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
      ) : (
        // Floating Mode: Code editor fills the main area, and video is a small floating overlay.
        <div className="relative min-h-screen bg-gray-100">
          {/* Main Content: Code Editor */}
          <div className="p-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
              <CodeEditorBlock />
            </div>
          </div>
          {/* Floating Video Block */}
          <div className="fixed bottom-4 right-4 w-80 h-48 rounded-lg border bg-white shadow-lg overflow-hidden">
            <HumanVideo room={room} />
          </div>
          {/* Button to switch back to Grid Mode */}
        </div>
      )}
    </div>
  );
}
