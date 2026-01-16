"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Room } from "@/utils/schema";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import RoomCard from "@/components/human/RoomCards";
import PDFViewer from "@/components/chat/PDFViewer";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomListContentProps {
  rooms: Room[];
  searchTerm?: string;
  currentPage: number;
  totalPages: number;
  totalRooms: number;
}

/**
 * Client component wrapper for the Human Interview Room LIST page (/human).
 * 
 * IMPORTANT: This component displays a LIST of rooms with pagination.
 * DO NOT confuse with components/human/HumanRoomContent.tsx which displays
 * a SINGLE room's details with video/editor (used in /human-rooms/[roomId]).
 * 
 * Originally located at: app/human/HumanRoomContent.tsx
 * Renamed to: RoomListContent.tsx for clarity (January 16, 2026)
 * 
 * Purpose:
 * - Manages PDF modal state to avoid rendering multiple modals (memory optimization)
 * - Handles pagination UI and navigation
 * - Displays grid of room cards
 * 
 * Features:
 * - Single modal instance for all room cards (lifted state)
 * - Pagination controls (Previous/Next buttons, page indicators)
 * - Total results display
 * - URL-based pagination state management
 * - Empty state handling (no results, no search results)
 * 
 * Created as part of P1.3 refactor
 * Extended in P1.2 for pagination
 * Moved to components/human in codebase reorganization
 */
export default function RoomListContent({ 
  rooms, 
  searchTerm, 
  currentPage, 
  totalPages,
  totalRooms 
}: RoomListContentProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const searchParams = useSearchParams();
  
  // Build pagination URLs
  const buildPaginationUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return `/human${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <>
      {/* Results summary */}
      {totalRooms > 0 && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalRooms)} of {totalRooms} rooms
        </div>
      )}

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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button 
            variant="outline" 
            disabled={currentPage <= 1}
            asChild={currentPage > 1}
            className="flex items-center gap-1"
            aria-label="Go to previous page"
          >
            {currentPage > 1 ? (
              <Link href={buildPaginationUrl(currentPage - 1)}>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </>
            )}
          </Button>
          
          <div className="flex items-center gap-2 px-4">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <Button 
            variant="outline"
            disabled={currentPage >= totalPages}
            asChild={currentPage < totalPages}
            className="flex items-center gap-1"
            aria-label="Go to next page"
          >
            {currentPage < totalPages ? (
              <Link href={buildPaginationUrl(currentPage + 1)}>
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}

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
