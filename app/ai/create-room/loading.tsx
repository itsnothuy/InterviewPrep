"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-5">
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center w-full max-w-6xl gap-10">
        {/* Form skeleton */}
        <div className="w-full lg:w-1/2 rounded-lg p-5 space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
          
          <div className="space-y-4 mt-8">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-24 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="h-12 bg-muted rounded animate-pulse w-1/3 mt-6" />
        </div>
        
        {/* Animation placeholder */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-5">
          <div className="w-64 h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
