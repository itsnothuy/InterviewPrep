"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import RoomDetails from "./RoomDetails";
import CodeEditorBlock from "@/components/code-editor/code-editor-block";
import { Room as RoomType } from "@/utils/schema";
const HumanVideo = dynamic<{ room: RoomType }>(
  () => import("@/components/human/video-player").then(mod => mod.HumanVideo),
  { ssr: false, loading: () => <div>Loading video...</div> }
);

interface HumanRoomContentProps {
  room: RoomType;
}

export default function HumanRoomContent({ room }: HumanRoomContentProps) {
  const [isFloatingMode, setIsFloatingMode] = useState(false);

  const toggleMode = () => {
    setIsFloatingMode((prev) => !prev);
  };

  // In Grid Mode, the video takes up 3/4 width; in floating mode, it’s fixed in the bottom‑right.
  const videoWrapperClass = isFloatingMode
    ? "fixed bottom-4 right-4 w-80 h-48 z-40"
    : "w-3/4 p-4 pr-2";
  const videoInnerClass = isFloatingMode
    ? "rounded-lg bg-white shadow-lg overflow-hidden h-full"
    : "rounded-lg bg-card text-card-foreground shadow-sm p-4 min-h-screen";

  return (
    <div className="min-h-screen relative">
  {/* Toggle Mode Button */}
  <div className="pt-4 pl-4">
    <Button onClick={toggleMode} variant="outline">
      {isFloatingMode ? "Hide Code Editor" : "Show Code Editor"}
    </Button>
  </div>
  
  {/* Always render the video container */}
  <div className={isFloatingMode ? "" : "grid grid-cols-4 min-h-screen"}>
    <div className={isFloatingMode ? videoWrapperClass : "col-span-3 p-4 pr-2"}>
      <div className={isFloatingMode ? videoInnerClass : "rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-h-[400px]"}>
        <HumanVideo room={room} />
      </div>
    </div>
    {!isFloatingMode && (
        <RoomDetails room={room} />
    )}
  </div>
  
  {/* Render Code Editor based on mode */}
  {isFloatingMode ? (
    <div className="p-4">
      <div className="rounded-lg bg-transparent shadow-sm p-4 w-full">
        <CodeEditorBlock />
      </div>
    </div>
  ) : null}
</div>
  );
}

