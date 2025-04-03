"use client";

import { db } from "@/utils/db";
import { UserAnswer, type UserAnswerType } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Link } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../../../../lotties/feedback.json";
import loading from "../../../../lotties/loading.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FeedbackProps {
  params: {
    interviewId: string;
  };
}

const Feedback = ({ params }: FeedbackProps) => {
  const [feedbackList, setFeedbackList] = useState<UserAnswerType[]>([]);
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    setLoading(true);
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    setFeedbackList(result);
    setLoading(false);
  };

  return (
    <div className="p-5 items-center justify-center">
      {isLoading ? (
        <div className="text-center items-center justify-center flex flex-col p-5">
          <h1 className="text-5xl font-bold text-white">
            We are processing your interview...
          </h1>
          <Lottie animationData={loading} width={500} height={500}></Lottie>
        </div>
      ) : (
        <>
          <div className="text-center p-3">
            <h1 className="lg:text-5xl text-3xl font-extrabold mb-2 bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent leading-tight lg:leading-snug">
              Congrats on Finishing Your Interview!
            </h1>
            <h2 className="text-xl font-medium text-gray-600">
              Below is your feedback!
            </h2>
          </div>
          <div className="flex flex-row justify-start items-center space-x-5 w-full">
            <div className="w-full justify-center">
              {feedbackList &&
                feedbackList.map((item, index) => (
                  <Collapsible
                    key={index}
                    className="w-full rounded-lg overflow-hidden mb-5"
                  >
                    <CollapsibleTrigger className="p-4 px-6 bg-orange-400 text-white rounded-md flex justify-between items-center text-left  mb-5 shadow-md">
                      <span>{item?.question}</span>
                      <ChevronDown className="w-6 h-6" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-4 space-y-3 bg-gray-100 rounded-md">
                      <h2 className="text-lg font-semibold text-black">
                        Rating: {item?.rating}
                      </h2>
                      <p className="p-3 border border-slate-300 rounded-md shadow-sm bg-white">
                        <strong>Your Answer:</strong> {item?.userAns}
                      </p>
                      <p className="p-3 border border-slate-300 rounded-md bg-orange-200 text-orange-900 shadow-sm">
                        <strong>Feedback:</strong> {item.feedback}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
            </div>
            <div className="w-1/2 flex-shrink-0 items-center justify-center">
              <Lottie animationData={animationData}></Lottie>
            </div>
          </div>

          <div className="justify-center flex items-center text-center">
            <Button variant="dashboardAiOrHuman" onClick={() => router.replace("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default Feedback;
