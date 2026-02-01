"use client";

import { Loader2, Mic } from "lucide-react";

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
          {/* Questions panel */}
          <div className="flex-1 p-6 bg-card rounded-lg space-y-4">
            <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
            </div>
            {/* Question navigation */}
            <div className="flex gap-2 mt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 bg-muted rounded-full animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Recording panel */}
          <div className="flex-1 flex flex-col items-center p-6 bg-card rounded-lg">
            {/* Webcam placeholder */}
            <div className="w-full max-w-md h-64 bg-muted rounded-lg animate-pulse flex items-center justify-center mb-6">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
            {/* Record button placeholder */}
            <div className="w-40 h-12 bg-muted rounded-lg animate-pulse flex items-center justify-center gap-2">
              <Mic className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
