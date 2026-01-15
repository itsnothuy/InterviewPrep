"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Room } from "@/utils/schema";
import { useState } from "react";
import RoomCard from "@/components/human/RoomCards";
import PDFViewer from "@/components/chat/PDFViewer";

interface HumanRoomContentProps {
  rooms: Room[];
  searchTerm?: string;
}

/**
 * Client component wrapper for the Human Interview Room page.
 * Manages PDF modal state to avoid rendering multiple modals (memory optimization).
 * 
 * This component was created as part of P1.3 refactor to:
 * - Lift modal state from individual RoomCard components to parent level
 * - Render a single modal instance instead of N modals for N cards
 * - Reduce memory footprint when displaying many rooms
 */
export default function HumanRoomContent({ rooms, searchTerm }: HumanRoomContentProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-lg text-muted-foreground mb-2">
              {searchTerm 
                ? `No rooms found for "${searchTerm}"`
                : "No interview rooms available yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm 
                ? "Try a different search term"
                : "Create the first room to get started"}
            </p>
            {!searchTerm && (
              <Button variant="dashboardAiOrHuman" asChild>
                <Link href="/human/create-room">Create Room</Link>
              </Button>
            )}
          </div>
        ) : (
          rooms.map((room) => {
            return (
              <RoomCard 
                key={room.id} 
                room={room} 
                onViewResume={() => setSelectedRoom(room)}
              />
            );
          })
        )}
      </div>

      {/* Single modal instance - rendered once for all cards */}
      {selectedRoom?.pdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 h-3/4 relative">
            <Button
              onClick={() => setSelectedRoom(null)}
              className="absolute top-3 left-2 p-3"
              variant="dashboard"
              aria-label="Close resume preview"
            >
              Close
            </Button>
            <PDFViewer pdf_url={selectedRoom.pdfUrl} />
          </div>
        </div>
      )}
    </>
  );
}
