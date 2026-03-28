// ARCH-001 FIX: Removed ~108 lines of dead commented code (original implementation using direct DB access)
// The old code used client-side Drizzle ORM which was a security issue (SEC-002)
// Current implementation uses secure API routes

// app/ai/interview/[interviewId]/start/page.tsx
"use client";

import { useEffect, useState } from "react";
import Questions from "@/components/interview/behavioral/Questions";
import RecordAnswer from "@/components/interview/behavioral/RecordAnswer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InterviewData {
  mockId: string;
  jsonMockResp: string;
  jobPosition: string;
  jobDescription: string;
  jobExperience: string;
  createdBy: string;
  createdAt: string;
}

interface Params {
  interviewId: string;
}

const AIStartInterview = ({ params }: { params: Params }) => {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [mockQuestions, setMockQuestions] = useState<any[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  useEffect(() => {
    const getInterviewDetails = async () => {
      try {
        const res = await fetch(`/api/interview/${params.interviewId}`);
        const data = await res.json();
        if (data.interviewData) {
          setInterviewData(data.interviewData);
          setMockQuestions(data.mockQuestions);
        } else {
          console.error("Interview data not found");
        }
      } catch (error) {
        console.error("Failed to fetch interview details:", error);
      }
    };
    getInterviewDetails();
  }, [params.interviewId]);

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="">
          <Questions mockQuestions={mockQuestions} activeQuestionIndex={activeQuestionIndex} />
          <div className="flex flex-row gap-3 justify-end">
            {activeQuestionIndex > 0 && (
              <Button variant={"dashboardAiOrHuman"} onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                Previous
              </Button>
            )}
            {activeQuestionIndex !== mockQuestions.length - 1 && (
              <Button variant={"dashboardAiOrHuman"} onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                Next
              </Button>
            )}
            <Link href={`/ai/interview/${interviewData?.mockId}/technical`}>
              {activeQuestionIndex === mockQuestions.length - 1 && (
                <Button variant={"dashboardAiOrHuman"}>Start Technical Interview</Button>
              )}
            </Link>
          </div>
        </div>
        <RecordAnswer
          mockQuestions={mockQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
    </div>
  );
};

export default AIStartInterview;
