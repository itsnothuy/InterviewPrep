"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { BellRing, WebcamIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDisplayedFileName } from "@/components/utils/fileNameHelpers"; // Import the helper


interface Params {
  interviewId: string;
}

interface InterviewData {
  // define the structure of your interview data
  mockId: string;
  jsonMockResp: string;
  jobPosition: string;
  jobDescription: string;
  jobExperience: string;
  createdBy: string;
  createdAt: string;
  resumeFile?: string;
}

const AIInterview = ({ params }: { params: Params }) => {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(
    null
  ); // Or `InterviewData[]` if it's an array.
  const [camEnabled, setCamEnabled] = useState(false);

  useEffect(() => {
    getInterviewDetails();
  }, []);

  //used to get interview details by mockid/interviewid
  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));
    setInterviewData(result[0] as InterviewData);
  };


  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-5">
        <div className="text-center">
          <h1 className="lg:text-4xl text-3xl font-extrabold mb-2 bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            Let&apos;s Get Started
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            {camEnabled ? (
              <Webcam
                onUserMedia={() => setCamEnabled(true)}
                onUserMediaError={() => setCamEnabled(false)}
                mirrored={true}
              />
            ) : (
              <div className="text-center">
                <WebcamIcon className="my-7 h-72 w-full p-20 bg-secondary rounded-lg border" />
                <Button
                  variant={"dashboardAiOrHuman"}
                  onClick={() => setCamEnabled(true)}
                >
                  Enabled Webcam and Microphone
                </Button>
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col space-y-5 ">
            <div className="p-5 rounded-lg border border-white">
              <h2 className="text-lg text-[#8290a4]">
                <strong className="text-gray-600">Job Role: </strong>
                {interviewData?.jobPosition}
              </h2>
              <h2 className="text-lg text-[#8290a4]">
                <strong className="text-gray-600">Job Description: </strong>
                {interviewData?.jobDescription}
              </h2>
              <h2 className="text-lg text-[#8290a4]">
                <strong className="text-gray-600">Years of Experience: </strong>
                {interviewData?.jobExperience}
              </h2>
              {interviewData?.resumeFile && (
                <h2 className="text-lg text-[#8290a4]">
                  <strong className="text-gray-600">Resume: </strong>
                  {getDisplayedFileName(interviewData.resumeFile)}
                </h2>
              )}
            </div>
            <div className="p-5 border rounded-lg border-white bg-white space-y-3">
              <h2 className="gap-2 items-center text-gray-500 text-lg font-medium flex flex-row">
                <BellRing />
                <strong>Some Reminders!</strong>
              </h2>
              <h2 className="text-[#64748bb1]">
                Before you start your mock AI interview, please ensure that your
                webcam and microphone are enabled. This allows the AI to better
                simulate a real-life interview experience by analyzing your body
                language and vocal tone. Make sure you are in a quiet
                environment with good lighting to get the most accurate
                feedback. Remember, this is a practice session, so feel free to
                take your time and treat it as you would a real interview.
              </h2>
            </div>
            <div>
              <div className="rounded-md w-fit text-md p-1">
                <Link href={"/ai/interview/" + params.interviewId + "/behavioral"}>
                  <Button variant="dashboardAiOrHuman">
                    <p className="text-white">Start Interview</p>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AIInterview;
