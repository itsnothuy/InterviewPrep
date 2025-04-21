// File: components/TechnicalAnswer.tsx
"use client";

import { useState } from "react";
import { chatSession } from "@/utils/GeminiAIModal";
import toast from "react-hot-toast";

interface TechnicalAnswerProps {
  mockId: string;
  questions: { id: number; questionText: string; difficulty: string }[];
  savedCodes: (string | null)[];
  userId: string;
  onDone: () => void;
}

export default function TechnicalAnswer({
  mockId,
  questions,
  savedCodes,
  userId,
  onDone,
}: TechnicalAnswerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBatchSubmit = async () => {
    if (savedCodes.some((code) => !code || code.trim() === "")) {
      toast.error("Please save code for all questions before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Evaluate all answers concurrently.
      const evaluationPromises = questions.map((question, index) => {
        const userCode = savedCodes[index] as string;
        const prompt = `
Question: "${question.questionText}"
Difficulty: ${question.difficulty}
User's code:
\`\`\`
${userCode}
\`\`\`
Please evaluate this code for correctness, efficiency, and clarity.
Return a JSON response with "rating" (1-10) and "feedback" (a short textual review) only.
        `;
        return chatSession
          .sendMessage(prompt)
          .then(async (aiResult) => {
            const responseText = await aiResult.response.text();
            // Clean and parse the response.
            const parsed = JSON.parse(
              responseText.replace(/```json/g, "").replace(/```/g, "").trim()
            );
            return { rating: parsed.rating || "", feedback: parsed.feedback || "" };
          })
          .catch((err) => {
            console.error(`Error evaluating question ${question.id}:`, err);
            toast.error(`Error evaluating question ${question.id}`);
            return { rating: "", feedback: "" };
          });
      });

      const evaluations = await Promise.all(evaluationPromises);

      // Submit all evaluated answers concurrently.
      const submissionPromises = questions.map((question, index) => {
        const userCode = savedCodes[index] as string;
        const { rating, feedback } = evaluations[index];
        const payload = {
          mockIdRef: mockId,
          questionId: question.id,
          userCode,
          feedback,
          rating,
          createdBy: userId,
        };
        return fetch("/api/insertCodingAnswer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              console.error(`Submission error for question ${question.id}:`, errorData);
              toast.error(`Submission error for question ${question.id}`);
            }
          })
          .catch((err) => {
            console.error(`Error submitting answer for question ${question.id}:`, err);
            toast.error(`Error submitting answer for question ${question.id}`);
          });
      });

      await Promise.all(submissionPromises);
      toast.success("All coding answers submitted successfully.");
      onDone();
    } catch (error) {
      console.error("Error during batch submission:", error);
      toast.error("Error during submission.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <button onClick={handleBatchSubmit} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit All"}
      </button>
    </div>
  );
}
