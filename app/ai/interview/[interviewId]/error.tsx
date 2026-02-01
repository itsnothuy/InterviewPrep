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
    console.error("Interview Error:", error);
  }, [error]);

  // Check for specific error types
  const isNotFound = error.message?.includes("not found") || error.message?.includes("404");
  const isForbidden = error.message?.includes("Forbidden") || error.message?.includes("403");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-text mb-2">
        {isNotFound
          ? "Interview not found"
          : isForbidden
          ? "Access denied"
          : "Failed to load interview"}
      </h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {isNotFound
          ? "This interview doesn't exist or may have been deleted."
          : isForbidden
          ? "You don't have permission to access this interview."
          : "We couldn't load the interview. Please try again."}
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-muted p-4 rounded-lg mb-4 text-sm max-w-lg overflow-auto">
          {error.message}
        </pre>
      )}
      <div className="flex gap-4">
        {!isNotFound && !isForbidden && (
          <Button onClick={reset} variant="default">
            Try again
          </Button>
        )}
        <Link href="/dashboard">
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
        <Link href="/ai/create-room">
          <Button variant="secondary">
            Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}
