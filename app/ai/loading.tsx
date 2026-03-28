"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
    </div>
  );
}
