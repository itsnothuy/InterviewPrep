"use client";

import { Loader2, Code } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-5">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-8 bg-muted rounded animate-pulse w-1/2 mx-auto mb-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/3 mx-auto" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Question panel */}
          <div className="lg:w-1/3 p-6 bg-card rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-muted-foreground" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/2" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
            </div>
            {/* Difficulty badge placeholder */}
            <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
          </div>
          
          {/* Code editor placeholder */}
          <div className="lg:w-2/3 p-6 bg-card rounded-lg">
            <div className="w-full h-96 bg-muted rounded-lg animate-pulse flex items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
            {/* Action buttons */}
            <div className="flex gap-4 mt-4 justify-end">
              <div className="w-24 h-10 bg-muted rounded animate-pulse" />
              <div className="w-32 h-10 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
