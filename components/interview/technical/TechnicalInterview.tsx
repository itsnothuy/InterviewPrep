// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import CodeEditorBlock from "@/components/code-editor-block";
// import { chatSession } from "@/utils/GeminiAIModal";
// import toast from "react-hot-toast";

// interface TechnicalInterviewProps {
//   mockId?: string;
//   onDone: () => void; // Callback after final submission
// }

// interface TechnicalQuestion {
//   id: number;
//   mockIdRef: string;
//   questionText: string;
//   difficulty: string;
// }

// const TechnicalInterview: React.FC<TechnicalInterviewProps> = ({ mockId, onDone }) => {
//   const [technicalQuestions, setTechnicalQuestions] = useState<TechnicalQuestion[]>([]);
//   const [activeIndex, setActiveIndex] = useState<number>(0);
//   // The code in the editor right now (not necessarily saved)
//   const [currentCode, setCurrentCode] = useState<string>("");

//   // The code that user explicitly "Saved." 
//   // If we have 2 questions, this array will have length 2, each initially null.
//   const [savedCodes, setSavedCodes] = useState<(string | null)[]>([]);

//   // Loading states
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Submitting states
//   const [submitting, setSubmitting] = useState(false);

//   // Debug logs for state changes.
//   useEffect(() => {
//     console.log("TechnicalQuestions State:", technicalQuestions);
//   }, [technicalQuestions]);

//   useEffect(() => {
//     console.log("ActiveIndex:", activeIndex, "SavedCodes:", savedCodes, "CurrentCode:", currentCode);
//   }, [activeIndex, savedCodes, currentCode]);

//   useEffect(() => {
//     if (!mockId) {
//       console.error("No mockId provided to TechnicalInterview");
//       return;
//     }
//     fetchOrGenerateQuestions(mockId);
//   }, [mockId]);

//   const fetchOrGenerateQuestions = async (mockIdRef: string) => {
//     setIsLoading(true);
//     try {
//       const res = await fetch(`/api/technicalQuestion/${mockIdRef}`);
//       const data = await res.json();
//       console.log("Fetched technical questions from DB:", data);
//       let questions: TechnicalQuestion[] = data.technicalQuestions || [];

//       if (questions.length === 0) {
//         console.log("No technical questions found - generating with Gemini...");
//         const prompt = `
// Generate 2 random LeetCode-style technical interview questions in JSON format.
// Each question should include:
//   - "questionText": the question text.
//   - "difficulty": one of "easy", "medium", or "hard".
// Return only the JSON array without any additional explanation.
// Example:
// [
//   {"questionText": "Given an array of integers, return indices of the two numbers such that they add up to a specific target.", "difficulty": "easy"},
//   {"questionText": "Given a binary tree, find its maximum depth.", "difficulty": "medium"}
// ]`;
//         const aiResult = await chatSession.sendMessage(prompt);
//         const responseText = await aiResult.response.text();
//         console.log("Gemini API response for questions:", responseText);
//         let generatedQuestions: any[] = JSON.parse(
//           responseText
//             .replace(/```json/g, "")
//             .replace(/```/g, "")
//             .trim()
//         );
//         console.log("Parsed Gemini questions:", generatedQuestions);
//         const toInsert = generatedQuestions.map((q: any) => ({
//           mockIdRef,
//           questionText: q.questionText,
//           difficulty: q.difficulty,
//         }));
//         console.log("Inserting these questions into DB:", toInsert);
//         await fetch("/api/createTechnicalQuestion", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             mockIdRef,
//             questions: toInsert,
//           }),
//         });
//         // Re-fetch the questions.
//         const refetch = await fetch(`/api/technicalQuestion/${mockIdRef}`);
//         const refetchData = await refetch.json();
//         console.log("Re-fetched technical questions:", refetchData);
//         questions = refetchData.technicalQuestions || [];
//       }
//       setTechnicalQuestions(questions);
//       setSavedCodes(questions.map(() => null));
//       setActiveIndex(0);
//       setCurrentCode("");
//     } catch (error) {
//       console.error("Error fetch/generate technical questions:", error);
//       toast.error("Failed to load coding questions.");
//     }
//     setIsLoading(false);
//   };

//   // Load saved code to currentCode when activeIndex or savedCodes changes.
//   useEffect(() => {
//     if (technicalQuestions.length === 0) return;
//     if (savedCodes[activeIndex] !== null) {
//       setCurrentCode(savedCodes[activeIndex] as string);
//     } else {
//       setCurrentCode("");
//     }
//   }, [activeIndex, technicalQuestions, savedCodes]);

//   const handleSolutionChange = (index: number, newCode: string) => {
//     console.log(`Changing code for question ${index + 1}:`, newCode);
//     setCurrentCode(newCode);
//   };

//   const handleSave = () => {
//     if (technicalQuestions.length === 0) return;
//     const updatedCodes = [...savedCodes];
//     updatedCodes[activeIndex] = currentCode;
//     setSavedCodes(updatedCodes);
//     console.log(`Saved code for question ${activeIndex + 1}:`, currentCode);
//     toast.success(`Code saved for Question #${activeIndex + 1}`);
//   };

//   const handlePrevious = () => {
//     if (activeIndex > 0) {
//       setActiveIndex(activeIndex - 1);
//       console.log("Navigated to previous question, new activeIndex:", activeIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (activeIndex < technicalQuestions.length - 1) {
//       setActiveIndex(activeIndex + 1);
//       console.log("Navigated to next question, new activeIndex:", activeIndex + 1);
//     }
//   };

//   const handleSubmitAll = async () => {
//     if (savedCodes.some((code) => !code || code.trim() === "")) {
//       console.error("Some questions have not been saved.");
//       toast.error("Please save code for all questions before submitting.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       for (let i = 0; i < technicalQuestions.length; i++) {
//         const question = technicalQuestions[i];
//         const userCode = savedCodes[i] as string;
//         let rating = "";
//         let feedback = "";
//         const codeFeedbackPrompt = `
// Question: "${question.questionText}"
// Difficulty: ${question.difficulty}
// User's code:
// \`\`\`
// ${userCode}
// \`\`\`
// Please evaluate the code for correctness, efficiency, and clarity.
// Return a JSON response with "rating" (1-10) and "feedback" (a short textual review) only.
//         `;
//         console.log(`Sending Gemini prompt for Q#${i + 1}:`, codeFeedbackPrompt);
//         try {
//           const aiResult = await chatSession.sendMessage(codeFeedbackPrompt);
//           const responseText = await aiResult.response.text();
//           console.log(`Gemini feedback response for Q#${i + 1}:`, responseText);
//           const parsed = JSON.parse(
//             responseText.replace(/```json/g, "").replace(/```/g, "").trim()
//           );
//           rating = parsed.rating || "";
//           feedback = parsed.feedback || "";
//         } catch (err) {
//           console.error(`Error generating AI feedback for Q#${i + 1}:`, err);
//           toast.error(`Error generating AI feedback for Q#${i + 1}`);
//         }

//         const payload = {
//           mockIdRef: mockId,
//           questionId: question.id,
//           userCode,
//           feedback,
//           rating,
//           createdBy: "some-user-id", // Replace with actual user ID
//         };
//         console.log(`Submitting payload for Q#${i + 1}:`, payload);
//         try {
//           const res = await fetch("/api/insertCodingAnswer", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           });
//           if (!res.ok) {
//             const errData = await res.json();
//             console.error(`Failed to store coding answer for Q#${i + 1}:`, errData);
//             toast.error(`Failed to store coding answer for Q#${i + 1}`);
//           } else {
//             console.log(`Successfully stored coding answer for Q#${i + 1}`);
//             toast.success(`Coding answer for Q#${i + 1} stored`);
//           }
//         } catch (error) {
//           console.error(`Error storing coding answer for Q#${i + 1}:`, error);
//           toast.error(`Error storing coding answer for Q#${i + 1}`);
//         }
//       }
//       onDone();
//     } catch (error) {
//       console.error("Error during final submission:", error);
//       toast.error("Error during final submission");
//     }
//     setSubmitting(false);
//   };

//   return (
//     <div className="p-5">
//       {isLoading ? (
//         <p>Loading technical questions...</p>
//       ) : (
//         <>
//           <h2 className="text-xl font-bold mb-3">Technical Interview</h2>
//           <div className="flex gap-2 mb-4">
//             {technicalQuestions.map((question, index) => (
//               <Button
//                 key={question.id}
//                 onClick={() => {
//                   setActiveIndex(index);
//                   console.log("Tab clicked, activeIndex set to:", index);
//                 }}
//                 variant={activeIndex === index ? "dashboardAiOrHuman" : "outline"}
//               >
//                 Problem {index + 1}
//               </Button>
//             ))}
//           </div>
//           <div className="space-y-4">
//             {technicalQuestions.map((question, i) =>
//               activeIndex === i ? (
//                 <div key={question.id}>
//                   <div className="border p-4 rounded mb-2">
//                     <p className="text-md font-semibold">
//                       Question {i + 1}: {question.questionText}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Difficulty: {question.difficulty}
//                     </p>
//                   </div>
//                   <CodeEditorBlock
//                     initialCode={currentCode}
//                     onCodeChange={(code) => handleSolutionChange(i, code)}
//                   />
//                 </div>
//               ) : null
//             )}
//           </div>
//           <div className="flex justify-between gap-3 mt-4">
//             {activeIndex > 0 && (
//               <Button onClick={handlePrevious} disabled={submitting}>
//                 Previous
//               </Button>
//             )}
//             <Button onClick={handleSave} disabled={submitting}>
//               Save
//             </Button>
//             {activeIndex < technicalQuestions.length - 1 ? (
//               <Button onClick={handleNext} disabled={submitting}>
//                 Next
//               </Button>
//             ) : (
//               <Button onClick={handleSubmitAll} disabled={submitting}>
//                 {submitting ? "Submitting..." : "Submit All"}
//               </Button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default TechnicalInterview;


// File: components/TechnicalInterview.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CodeEditorBlock from "@/components/code-editor/code-editor-block";
import { chatSession } from "@/utils/GeminiAIModal";
import toast from "react-hot-toast";

interface TechnicalInterviewProps {
  mockId: string;
  userId: string;
  onDone: () => void;
}

interface TechnicalQuestion {
  id: number;
  mockIdRef: string;
  questionText: string;
  difficulty: string;
}

const TechnicalInterview: React.FC<TechnicalInterviewProps> = ({
  mockId,
  userId,
  onDone,
}) => {
  // Fetched technical questions
  const [technicalQuestions, setTechnicalQuestions] = useState<TechnicalQuestion[]>([]);
  // The user’s “committed” solutions (only updated when pressing “Save”)
  const [userSolutions, setUserSolutions] = useState<string[]>([]);
  // The user’s in-progress code for each question (auto-updated on typing)
  const [draftSolutions, setDraftSolutions] = useState<string[]>([]);
  // The current active question index
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // Submission status
  const [submitting, setSubmitting] = useState<boolean>(false);

   // Log updated userSolutions whenever it changes
   useEffect(() => {
    console.log("userSolutions updated:", userSolutions);
  }, [userSolutions]);

  // Fetch technical questions on component mount
  useEffect(() => {
    if (!mockId) return;

    const fetchTechnicalQuestions = async () => {
      try {
        const res = await fetch(`/api/technicalQuestion/${mockId}`);
        const data = await res.json();
        console.log("Fetched data:", data); 
        
        const questions: TechnicalQuestion[] = data.technicalQuestions || [];

        if (questions.length === 0) {
          toast.error("No technical questions found.");
          return;
        }

        setTechnicalQuestions(questions);
        // Initialize both arrays—one for committed solutions, one for drafts
        setUserSolutions(questions.map(() => ""));
        setDraftSolutions(questions.map(() => ""));
      } catch (error) {
        console.error("Error fetching technical questions:", error);
        toast.error("Failed to load technical questions.");
      }
    };

    fetchTechnicalQuestions();
  }, [mockId]);

  // Track user’s code changes in draftSolutions, but do NOT automatically save
  const handleSolutionChange = (index: number, newCode: string) => {
    const updatedDrafts = [...draftSolutions];
    updatedDrafts[index] = newCode;
    setDraftSolutions(updatedDrafts);
  };

  // Manually “save” the current draft into userSolutions
  const handleSave = () => {
    if (!technicalQuestions[activeIndex]) return; // Safety check
    const updatedSolutions = [...userSolutions];
    console.log("updatedSolutions:", updatedSolutions);
    updatedSolutions[activeIndex] = draftSolutions[activeIndex];
    console.log(`Saved code for question ${activeIndex + 1}:`, updatedSolutions[activeIndex]);
    setUserSolutions(updatedSolutions);
    toast.success(`Solution for Question #${activeIndex + 1} saved!`);
  };

  // Navigation
  const handlePrevious = () => {
    handleSave();
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    handleSave();
    if (activeIndex < technicalQuestions.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  // Final submission: check for any question with an empty userSolution
  const handleSubmitAll = async () => {
    console.log("All user solutions:", userSolutions);
    // Check if any solution is empty
    if (userSolutions.some((solution) => solution.trim() === "")) {
      toast.error("Please save code for all questions before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      // Loop over each question
      for (let i = 0; i < technicalQuestions.length; i++) {
        const question = technicalQuestions[i];
        const userCode = userSolutions[i];
        let rating = "";
        let feedback = "";

        // Prompt for AI feedback
        const codeFeedbackPrompt = `
Question: "${question.questionText}"
Difficulty: ${question.difficulty}
User's code:
\`\`\`
${userCode}
\`\`\`
Please evaluate the code for correctness, efficiency, and clarity.
Return a JSON response with "rating" (1-10) and "feedback" (a short review) only.
        `;

        try {
          const aiResult = await chatSession.sendMessage(codeFeedbackPrompt);
          const responseText = await aiResult.response.text();
          // Remove any code block markers and parse
          const parsed = JSON.parse(
            responseText.replace(/```json/g, "").replace(/```/g, "").trim()
          );
          rating = parsed.rating || "";
          feedback = parsed.feedback || "";
        } catch (err) {
          console.error(`Error evaluating answer for question ${i + 1}:`, err);
          toast.error(`Error generating AI feedback for question ${i + 1}`);
        }

        // Send the final payload to the backend
        const payload = {
          mockIdRef: mockId,
          questionId: question.id,
          questionText: question.questionText,
          userCode,
          feedback,
          rating,
          createdBy: userId,
        };
        console.log(`Submitting payload for Q#${i + 1}:`, payload);
        try {
          const res = await fetch("/api/insertCodingAnswer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const errData = await res.json();
            console.error(`Failed to store answer for question ${i + 1}:`, errData);
            toast.error(`Failed to store answer for question ${i + 1}`);
          } else {
            toast.success(`Answer for question ${i + 1} saved successfully.`);
          }
        } catch (error) {
          console.error(`Error submitting answer for question ${i + 1}:`, error);
          toast.error(`Error submitting answer for question ${i + 1}`);
        }
      }
        console.log("Finished submission for all questions. userSolutions:", userSolutions);
        console.log("Calling onDone callback now.");
      // Once all submissions succeed, call the onDone callback
      onDone();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Error during submission");
    }
    setSubmitting(false);
  };

  // If questions are not yet loaded or were empty
  if (!technicalQuestions || technicalQuestions.length === 0) {
    return <div className="p-5">Loading technical questions...</div>;
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3">Technical Interview</h2>

      {/* Navigation tabs for each problem */}
      <div className="flex gap-2 mb-4">
        {technicalQuestions.map((_, i) => (
          <Button
            key={i}
            onClick={() => setActiveIndex(i)}
            variant={activeIndex === i ? "dashboardAiOrHuman" : "outline"}
          >
            Problem {i + 1}
          </Button>
        ))}
      </div>

      {/* All editors remain mounted, only active one is displayed */}
      <div className="space-y-4">
        {technicalQuestions.map((question, i) => (
          <div key={question.id} style={{ display: activeIndex === i ? "block" : "none" }}>
            <div className="border p-4 rounded mb-2">
              <p className="text-md font-semibold">
                Question {i + 1}: {question.questionText}
              </p>
              <p className="text-sm text-gray-500">Difficulty: {question.difficulty}</p>
            </div>
            <CodeEditorBlock
              initialCode={draftSolutions[i]}
              onCodeChange={(newCode) => handleSolutionChange(i, newCode)}
            />
          </div>
        ))}
      </div>

      {/* Navigation and Save/Submit */}
      <div className="flex flex-wrap gap-3 mt-4 items-center">
        {activeIndex > 0 && (
          <Button variant="dashboardAiOrHuman" onClick={handlePrevious} disabled={submitting}>
            Previous
          </Button>
        )}
        <Button variant="dashboardAiOrHuman" onClick={handleSave} disabled={submitting}>
          Save
        </Button>
        {activeIndex < technicalQuestions.length - 1 && (
          <Button variant="dashboardAiOrHuman" onClick={handleNext} disabled={submitting}>
            Next
          </Button>
        )}

        {/* Only show "Submit All" when on the last question, or you can show it always */}
        {activeIndex === technicalQuestions.length - 1 && (
          <Button variant="dashboardAiOrHuman" onClick={handleSubmitAll} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit All"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TechnicalInterview;
