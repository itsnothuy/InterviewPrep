/**
 * RoomCardSkeleton Component
 * 
 * Purpose: Loading skeleton for RoomCard component
 * Displays placeholder UI while room data is being fetched
 * 
 * Created as part of P2.1 implementation
 * Improves perceived performance during data loading
 * 
 * Design:
 * - Matches RoomCard layout structure
 * - Uses shimmer animation for visual feedback
 * - Responsive to match actual card dimensions
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RoomCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        {/* Room name skeleton */}
        <CardTitle>
          <div className="h-6 bg-muted/50 rounded animate-pulse w-3/4" />
        </CardTitle>
        {/* Description skeleton */}
        <CardDescription>
          <div className="h-4 bg-muted/50 rounded animate-pulse w-full mt-2" />
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4">
        {/* Language tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted/50 rounded animate-pulse w-20" />
          <div className="h-6 bg-muted/50 rounded animate-pulse w-24" />
        </div>
        
        {/* GitHub link skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted/50 rounded animate-pulse" />
          <div className="h-4 bg-muted/50 rounded animate-pulse w-32" />
        </div>
      </CardContent>
      
      <CardFooter>
        {/* Join button skeleton */}
        <div className="h-10 bg-muted/50 rounded animate-pulse w-28" />
        {/* PDF button skeleton */}
        <div className="h-10 w-10 bg-muted/50 rounded-md animate-pulse ml-2" />
      </CardFooter>
    </Card>
  );
}
