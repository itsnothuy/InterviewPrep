"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Create Room Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-text mb-2">Failed to load interview setup</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We couldn&apos;t load the interview creation form. This might be a temporary issue.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-muted p-4 rounded-lg mb-4 text-sm max-w-lg overflow-auto">
          {error.message}
        </pre>
      )}
      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Link href="/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
