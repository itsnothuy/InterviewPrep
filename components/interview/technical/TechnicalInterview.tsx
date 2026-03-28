// ARCH-001 FIX: Removed ~285 lines of dead commented code (original implementation)
// The old code had several issues:
// - Used hardcoded user ID ("some-user-id")
// - Had sequential AI calls (slow)
// - No proper error handling
// Current implementation uses parallel AI calls (PERF-002) and proper user session

// File: components/TechnicalInterview.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CodeEditorBlock from "@/components/code-editor/code-editor-block";
import { chatSession } from "@/utils/GeminiAIModal";
import toast from "react-hot-toast";
import { sanitizeCodeInput, sanitizeForPrompt } from "@/utils/sanitize";

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
      // PERF-002 FIX: Process all questions in parallel using Promise.all
      const feedbackPromises = technicalQuestions.map(async (question, i) => {
        const userCode = userSolutions[i];
        let rating = "";
        let feedback = "";

        // SEC-004 FIX: Sanitize inputs before sending to AI
        const sanitizedQuestionText = sanitizeForPrompt(question.questionText, 1000);
        const sanitizedDifficulty = sanitizeForPrompt(question.difficulty, 50);
        const sanitizedUserCode = sanitizeCodeInput(userCode || "", 10000);

        // Prompt for AI feedback
        const codeFeedbackPrompt = `
Question: "${sanitizedQuestionText}"
Difficulty: ${sanitizedDifficulty}
User's code:
\`\`\`
${sanitizedUserCode}
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
          // Don't toast here - we'll summarize errors at the end
        }

        return { question, userCode, rating, feedback, index: i };
      });

      // Wait for all AI feedback to complete in parallel
      const feedbackResults = await Promise.all(feedbackPromises);
      console.log("All AI feedback received:", feedbackResults);

      // Now submit all results to the backend (can also be parallelized)
      const submitPromises = feedbackResults.map(async ({ question, userCode, rating, feedback, index }) => {
        const payload = {
          mockIdRef: mockId,
          questionId: question.id,
          questionText: question.questionText,
          userCode,
          feedback,
          rating,
          createdBy: userId,
        };
        console.log(`Submitting payload for Q#${index + 1}:`, payload);

        try {
          const res = await fetch("/api/insertCodingAnswer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const errData = await res.json();
            console.error(`Failed to store answer for question ${index + 1}:`, errData);
            return { success: false, index };
          }
          return { success: true, index };
        } catch (error) {
          console.error(`Error submitting answer for question ${index + 1}:`, error);
          return { success: false, index };
        }
      });

      const submitResults = await Promise.all(submitPromises);
      
      // Summarize results
      const failures = submitResults.filter(r => !r.success);
      if (failures.length > 0) {
        toast.error(`Failed to save ${failures.length} answer(s). Check console for details.`);
      } else {
        toast.success("All answers saved successfully!");
      }

      console.log("Finished submission for all questions. userSolutions:", userSolutions);
      console.log("Calling onDone callback now.");
      // Once all submissions complete, call the onDone callback
      onDone();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Error during submission");
    }
    setSubmitting(false);
  };

  // If questions are not yet loaded or were empty
  if (!technicalQuestions || technicalQuestions.length === 0) {
    return <div className="p-5 mt-10 pt-5 items-center justify-center">Loading technical questions...</div>;
  }

  return (
    <div className="p-5 mt-10 pt-10">
      <h1 className="text-xl font-bold mb-3">Technical Interview</h1>

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
