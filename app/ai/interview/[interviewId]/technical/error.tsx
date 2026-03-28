"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const interviewId = params?.interviewId as string;

  useEffect(() => {
    console.error("Technical Interview Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold text-text mb-2">
        Technical interview error
      </h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        We encountered a problem loading the coding questions. Your code has been saved.
      </p>
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-muted p-4 rounded-lg mb-4 text-sm max-w-lg overflow-auto">
          {error.message}
        </pre>
      )}
      <div className="flex gap-4 flex-wrap justify-center">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        {interviewId && (
          <>
            <Link href={`/ai/interview/${interviewId}/behavioral`}>
              <Button variant="outline">
                Back to Behavioral
              </Button>
            </Link>
            <Link href={`/ai/interview/${interviewId}/feedback`}>
              <Button variant="secondary">
                Skip to Feedback
              </Button>
            </Link>
          </>
        )}
        <Link href="/dashboard">
          <Button variant="ghost">
            Exit to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
