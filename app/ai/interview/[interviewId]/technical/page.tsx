// app/ai/interview/[interviewId]/technical/page.tsx
"use client";
import { useSession } from "next-auth/react";
import TechnicalInterview from "@/components/interview/technical/TechnicalInterview";
import { useRouter } from "next/navigation";

export default function TechnicalPage({ params }: { params: { interviewId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  
  const handleDone = () => {
    console.log("onDone has been called.");
    // Redirect to the feedback page.
    router.push(`/ai/interview/${params.interviewId}/feedback`);
  };

  if (!session) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div>
      <TechnicalInterview mockId={params.interviewId} userId={session.user.id} onDone={handleDone} />
    </div>
  );
}
