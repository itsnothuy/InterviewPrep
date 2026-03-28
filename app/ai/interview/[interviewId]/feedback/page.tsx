// ARCH-001 FIX: Removed ~98 lines of dead commented code (original implementation using direct DB access)
// The old code used client-side Drizzle ORM which was a security issue (SEC-002)
// Current implementation uses secure API routes

// File: app/ai/interview/[interviewId]/feedback/page.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import loadingAnimation from "../../../../lotties/loading.json";
import { Button } from "@/components/ui/button";
import { cleanJSONString } from "@/utils/cleanJSON";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });


interface FeedbackProps {
  params: {
    interviewId: string;
  };
}

// Define types for feedback items. Adjust fields as needed.
interface BehavioralFeedbackItem {
  question: string;
  userAns: string;
  rating: string;
  feedback: string;
}

interface TechnicalFeedbackItem {
  questionText: string;
  userCode: string;
  rating: string;
  feedback: string;
}

const Feedback = ({ params }: FeedbackProps) => {
  const [behavioralFeedback, setBehavioralFeedback] = useState<BehavioralFeedbackItem[]>([]);
  const [technicalFeedback, setTechnicalFeedback] = useState<TechnicalFeedbackItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch both behavioral and technical feedback
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        // Behavioral feedback from a dedicated endpoint
        const resBehavioral = await fetch(`/api/feedback/behavioral/${params.interviewId}`);
        const dataBehavioral = await resBehavioral.json();
        setBehavioralFeedback(dataBehavioral.feedback || []);

        // Technical feedback from a dedicated endpoint
        const resTechnical = await fetch(`/api/feedback/technical/${params.interviewId}`);
        const dataTechnical = await resTechnical.json();
        console.log("Technical feedback data:", dataTechnical);
        const technicalData = (dataTechnical.feedback || []).map((item: TechnicalFeedbackItem) => ({
          ...item,
          userCode: cleanJSONString(item.userCode)
        }));
        setTechnicalFeedback(technicalData);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
      setLoading(false);
    };

    fetchFeedback();
  }, [params.interviewId]);

  return (
    <div className="p-5 flex flex-col items-center justify-center mt-10 pt-5">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-5 text-center">
          <h1 className="text-5xl font-bold text-white">We are processing your interview...</h1>
          <Lottie animationData={loadingAnimation} width={500} height={500} />
        </div>
      ) : (
        <>
          <div className="text-center p-3 mb-10">
            <h1 className="lg:text-5xl text-3xl font-extrabold mb-2 bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent leading-tight lg:leading-snug">
              You have finished the Interview!
            </h1>
            <h2 className="text-xl font-medium text-gray-600">Below is your feedback!</h2>
          </div>

          {/* Behavioral Feedback Section */}
          <div className="w-full mb-10">
            <h2 className="text-2xl font-bold mb-4">Behavioral Interview Feedback</h2>
            {behavioralFeedback.length === 0 ? (
              <p>No behavioral feedback available.</p>
            ) : (
              behavioralFeedback.map((item, index) => (
                <Collapsible key={index} className="w-full rounded bg-gray-100 p-1 mb-5">
                  <CollapsibleTrigger className=" w-full p-4 px-6 pt-5 text-black rounded-md flex justify-between items-center text-left">
                    <span><strong>Question {index + 1}:</strong> {item.question}</span>
                    <ChevronDown className="w-6 h-6" />
                  </CollapsibleTrigger>
                  <DropdownMenuSeparator/>
                  <CollapsibleContent className="p-4 space-y-3 bg-gray-100 rounded-md">
                    <h2 className="text-lg font-semibold text-black">Rating: {item.rating}</h2>
                    <p className="p-3 border border-slate-300 rounded-md">
                      <strong>Your Answer:</strong> {item.userAns}
                    </p>
                    <p className="p-3 border border-slate-300 rounded-md text-orange-900">
                      <strong className="text-black">Feedback:</strong> {item.feedback}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>

          {/* Technical Feedback Section */}
          <div className="w-full mb-10">
            <h2 className="text-2xl font-bold mb-4">Technical Interview Feedback</h2>
            {technicalFeedback.length === 0 ? (
              <p>No technical feedback available.</p>
            ) : (
              technicalFeedback.map((item, index) => (
                <Collapsible key={index} className="rounded border bg-gray-100 p-1 mb-5">
                  <CollapsibleTrigger className="p-4 px-6 pt-5 flex justify-between items-center text-left">
                    <span><strong>Problem {index + 1}:</strong>  {item.questionText}</span>
                    <ChevronDown className="w-6 h-6" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-3 rounded-md">
                    <h2 className="text-lg font-semibold text-black">Rating: {item.rating}</h2>
                    <p className="p-3 border border-slate-300 rounded-md">
                      <strong>Your Answer:</strong> {item.userCode}
                    </p>
                    <p className="p-3 border border-slate-300 rounded-md text-blue-900">
                      <strong className="text-black">Feedback:</strong> {item.feedback}
                    </p>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>

          <div className="flex justify-center items-center">
            <Button variant="dashboardAiOrHuman" onClick={() => router.replace("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>

          {/* Optionally display an animated graphic on the side */}
          {/* <div className="w-full flex justify-center mt-10">
            <Lottie animationData={animationData} width={500} height={500} />
          </div> */}
        </>
      )}
    </div>
  );
};

export default Feedback;
