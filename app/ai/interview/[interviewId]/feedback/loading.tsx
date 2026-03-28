"use client";

import { Loader2, Star, MessageSquare } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-5">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-8 bg-muted rounded animate-pulse w-1/2 mx-auto mb-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3 mx-auto" />
        </div>
        
        {/* Summary card */}
        <div className="p-6 bg-card rounded-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-muted-foreground" />
              <div className="h-6 bg-muted rounded animate-pulse w-16" />
            </div>
          </div>
          <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
        
        {/* Feedback sections */}
        <div className="space-y-6">
          {/* Behavioral feedback skeleton */}
          <div className="p-6 bg-card rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Technical feedback skeleton */}
          <div className="p-6 bg-card rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <div className="h-6 bg-muted rounded animate-pulse w-1/4" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action button */}
        <div className="flex justify-center mt-8">
          <div className="h-12 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
