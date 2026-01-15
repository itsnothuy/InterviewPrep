/**
 * Loading State for Human Interview Room Page
 * 
 * Purpose: Displayed while /human page data is being fetched
 * Uses Next.js 14 App Router automatic loading UI feature
 * 
 * Created as part of P2.1 implementation
 * 
 * Behavior:
 * - Automatically shown during page navigation
 * - Matches actual page layout structure
 * - Displays 12 skeleton cards (default page size)
 * 
 * Note: SearchBar removed from loading state to avoid Suspense boundary issues
 * The actual SearchBar will appear once the page fully loads
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoomCardSkeleton from "@/components/human/RoomCardSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen p-16">
      {/* Header section */}
      <div className="flex justify-between w-full items-center mb-10">
        <h1 className="text-4xl text-white">Find Interview Room</h1>
        <Button variant={"dashboardAiOrHuman"} asChild>
          <Link href="/human/create-room">Create Room</Link>
        </Button>
      </div>
      
      {/* Search bar skeleton */}
      <div className="mb-12">
        <div className="h-10 bg-muted/50 rounded animate-pulse max-w-md" />
      </div>
      
      {/* Skeleton grid matching actual layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render 12 skeleton cards (default page size) */}
        {Array.from({ length: 12 }).map((_, index) => (
          <RoomCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    </main>
  );
}
