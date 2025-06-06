// "use client";

// import { db } from "@/utils/db";
// import { MockInterview } from "@/utils/schema";
// import { useEffect, useState } from "react";
// import { eq } from "drizzle-orm";
// import Questions from "@/components/Questions";
// import RecordAnswer from "@/components/RecordAnswer";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// interface Params {
//   interviewId: string;
// }

// interface Question {
//   question: string;
// }

// interface InterviewData {
//   mockId: string;
//   jsonMockResp: string;
//   jobPosition: string;
//   jobDescription: string;
//   jobExperience: string;
//   createdBy: string;
//   createdAt: string;
// }

// const AIStartInterview = ({ params }: { params: Params }) => {
//   const [interviewData, setInterviewData] = useState<InterviewData | null>(
//     null
//   );
//   const [mockQuestions, setMockQuestions] = useState<[]>([]);
//   const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

//   useEffect(() => {
//     getInterviewDetails();
//   }, []);
//   const getInterviewDetails = async () => {
//     const result = await db
//       .select()
//       .from(MockInterview)
//       .where(eq(MockInterview.mockId, params.interviewId));

//     if (result.length > 0) {
//       try {
//         let jsonString = result[0].jsonMockResp;

//         // Remove any text after the closing bracket of the JSON array
//         const closingBracketIndex = jsonString.lastIndexOf("}]");
//         if (closingBracketIndex !== -1) {
//           jsonString = jsonString.substring(0, closingBracketIndex + 2);
//         }

//         // Further clean the JSON string
//         jsonString = jsonString
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .replace(/\\n/g, "")
//           .replace(/\r/g, "")
//           .trim();

//         // Parse the cleaned JSON string
//         const jsonMockResponse: [] = JSON.parse(jsonString);

//         // Set state with parsed JSON data
//         setInterviewData(result[0] as InterviewData);
//         setMockQuestions(jsonMockResponse);
//       } catch (error) {
//         console.error("Failed to parse JSON:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-5">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div>
//           <Questions
//             mockQuestions={mockQuestions}
//             activeQuestionIndex={activeQuestionIndex}
//           />
//           <div className="flex flex-row gap-3 justify-end">
//             {activeQuestionIndex > 0 && (
//               <Button 
//                 variant={"dashboardAiOrHuman"}
//                 onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
//               >
//                 Previous Question
//               </Button>
//             )}
//             {activeQuestionIndex != mockQuestions?.length - 1 && (
//               <Button 
//                 variant={"dashboardAiOrHuman"}
//                 onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
//               >
//                 Next Question
//               </Button>
//             )}
//             <Link href={"/ai/interview/" + interviewData?.mockId + "/feedback"}>
//               {activeQuestionIndex == mockQuestions?.length - 1 && (
//                 <Button variant={"dashboardAiOrHuman"}>End Interview</Button>
//               )}
//             </Link>
//           </div>
//         </div>
//         <RecordAnswer
//           mockQuestions={mockQuestions}
//           activeQuestionIndex={activeQuestionIndex}
//           interviewData={interviewData}
//         />{" "}
//       </div>
//     </div>
//   );
// };

// export default AIStartInterview;


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
