"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-5">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse w-2/3 mx-auto" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2 mx-auto" />
        </div>
        
        {/* Main content skeleton */}
        <div className="flex flex-col items-center mt-10 space-y-6">
          {/* Webcam placeholder */}
          <div className="w-80 h-60 bg-muted rounded-lg animate-pulse flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
          
          {/* Info box skeleton */}
          <div className="w-full max-w-lg p-6 bg-muted rounded-lg animate-pulse space-y-3">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
            <div className="h-4 bg-muted-foreground/20 rounded w-1/2" />
            <div className="h-4 bg-muted-foreground/20 rounded w-2/3" />
          </div>
          
          {/* Button skeleton */}
          <div className="h-12 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
