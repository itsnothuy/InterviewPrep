"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import CodeEditorBlock from "@/components/code-editor/code-editor-block";
import RoomErrorBoundary from "./RoomErrorBoundary";
import TabView from "./TabView";
import Clock from "./Clock";
import RoomDetails from "./RoomDetails";
import { Room as RoomType } from "@/utils/schema";

const HumanVideo = dynamic<{ room: RoomType }>(
  () => import("@/components/human/video-player").then(mod => mod.HumanVideo),
  { ssr: false, loading: () => <div>Loading video...</div> }
);

interface HumanRoomContentNewProps {
  room: RoomType;
}

export default function HumanRoomContentNew({ room }: HumanRoomContentNewProps) {
  return (
    <RoomErrorBoundary>
      <HumanRoomContentNewInner room={room} />
    </RoomErrorBoundary>
  );
}

function HumanRoomContentNewInner({ room }: HumanRoomContentNewProps) {
  // Resizable panel state
  const [editorWidth, setEditorWidth] = useState<number>(50);
  const isDragging = useRef<boolean>(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Resizer handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.classList.add("resizing");
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !mainContentRef.current) return;

    const containerRect = mainContentRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const totalWidth = containerRect.width;

    let percentage = (mouseX / totalWidth) * 100;
    percentage = 100 - percentage; // Invert for right panel
    const newWidth = Math.min(Math.max(percentage, 30), 70); // Clamp 30-70%
    setEditorWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "default";
    document.body.classList.remove("resizing");
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setEditorWidth(100);
      } else {
        setEditorWidth(50);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full bg-[#161616] text-[#f4f4f4]">
      <div className="h-full flex flex-col md:flex-row">
        {/* Left Sidebar - Fixed 320px */}
        <div className="w-80 md:h-screen bg-[#262626] border-r border-[#393939] flex flex-col">
          {/* Room Header */}
          <div className="p-4 border-b border-[#393939]">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-medium text-[#f4f4f4] truncate">
                  Room: {room.name}
                </h1>

                <div className="flex items-center gap-2">
                  {/* Status Badge - Always active for now */}
                  <span
                    className="inline-flex items-center h-[32px] px-3 text-xs font-medium bg-[#054f1750] text-[#42be65] border border-[#42be65]"
                  >
                    Active
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#8d8d8d]">
                Created: {room.createdAt.toLocaleDateString()}
              </p>
              {room.description && (
                <p className="text-xs text-[#c6c6c6] mt-1">
                  {room.description}
                </p>
              )}
            </div>
          </div>

          {/* Video Section */}
          <div className="p-4 space-y-4 border-b border-[#393939]">
            <div className="space-y-2">
              <p className="text-xs text-[#c6c6c6] font-medium">
                Interview Video
              </p>
              <div className="rounded-sm border border-[#393939] w-full h-48 shadow-lg bg-[#161616] overflow-hidden">
                <HumanVideo room={room} />
              </div>
            </div>
          </div>

          {/* TabView Section (Room Details / Activity Log) */}
          <div className="flex-1 px-4 overflow-hidden">
            <TabView>
              <RoomDetails room={room} />
            </TabView>
          </div>

          {/* Clock at bottom */}
          <div className="p-4 border-t border-[#393939] bg-[#262626]">
            <Clock />
          </div>
        </div>

        {/* Main Content Area - Resizable */}
        <div
          ref={mainContentRef}
          className="flex-1 flex flex-col md:flex-row min-w-0 bg-[#262626]"
        >
          {/* Video Notes / WriteSpace (future) */}
          <div
            style={{ width: isMobile ? "100%" : `${100 - editorWidth}%` }}
            className={`relative min-w-[30%] ${isMobile ? "h-1/2" : "h-full"} border-b md:border-b-0 md:border-r border-[#393939] bg-[#161616]`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-[#393939] flex items-center justify-between">
                <h2 className="text-sm font-medium text-[#f4f4f4]">Notes</h2>
              </div>
              <div className="flex-1 p-4 overflow-y-auto text-[#8d8d8d] text-sm">
                <p className="mb-2">Interview notes panel</p>
                <p className="text-xs">
                  Rich text editor with TipTap will go here in Phase 5 (optional)
                </p>
              </div>
            </div>

            {/* Resizer */}
            {!isMobile && (
              <div
                className="absolute right-0 top-0 w-1 h-full bg-[#393939] hover:bg-[#0f62fe] cursor-col-resize transition-colors z-10"
                onMouseDown={handleMouseDown}
                style={{ userSelect: "none", touchAction: "none" }}
              />
            )}
          </div>

          {/* Code Editor */}
          <div
            style={{
              width: isMobile ? "100%" : `${editorWidth}%`,
              height: isMobile ? "50%" : "100%",
            }}
            className="flex flex-col min-w-[30%] bg-[#161616]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#393939]">
              <h2 className="text-sm font-medium text-[#f4f4f4]">
                Code Editor
              </h2>
            </div>
            <div className="flex-1 bg-[#161616] overflow-hidden">
              <CodeEditorBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
