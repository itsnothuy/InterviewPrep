// File: components/BatchAnswer.tsx
"use client";

import { useState } from "react";
import { chatSession } from "@/utils/GeminiAIModal";
import toast from "react-hot-toast";

interface BatchAnswerProps {
  mockId: string;
  userId: string;
  questions: Array<{
    id: number;
    questionText: string;
    difficulty: string;
  }>;
  userSolutions: string[]; // The code for each question
  onDone: () => void;      // Callback after final submission
}

export default function BatchAnswer({
  mockId,
  userId,
  questions,
  userSolutions,
  onDone,
}: BatchAnswerProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitAll = async () => {
    // 1) Ensure all solutions are non-empty
    if (userSolutions.some((code) => code.trim() === "")) {
      toast.error("Please complete all coding questions before submitting.");
      return;
    }
    setSubmitting(true);

    try {
      // 2) Evaluate each solution with Gemini, then POST to /api/insertCodingAnswer
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        let rating = "";
        let feedback = "";
        const prompt = `
Question: "${q.questionText}"
Difficulty: ${q.difficulty}
User's code:
\`\`\`
${userSolutions[i]}
\`\`\`
Please evaluate the code for correctness, efficiency, and clarity.
Return a JSON response with "rating" (1-10) and "feedback".
        `;
        try {
          const aiResult = await chatSession.sendMessage(prompt);
          const responseText = await aiResult.response.text();
          const parsed = JSON.parse(
            responseText.replace(/```json/g, "").replace(/```/g, "").trim()
          );
          rating = parsed.rating || "";
          feedback = parsed.feedback || "";
        } catch (err) {
          console.error(`Error evaluating question #${i + 1}`, err);
          toast.error(`AI feedback error for question #${i + 1}`);
        }
        // Build payload
        const payload = {
          mockIdRef: mockId,
          questionId: q.id,
          userCode: userSolutions[i],
          feedback,
          rating,
          createdBy: userId,
        };
        // Post to your /api/insertCodingAnswer
        const res = await fetch("/api/insertCodingAnswer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errData = await res.json();
          console.error(`Failed storing answer #${i + 1}`, errData);
          toast.error(`Failed storing answer #${i + 1}`);
        } else {
          toast.success(`Answer for question #${i + 1} submitted`);
        }
      }
      onDone();
    } catch (error) {
      console.error("Error in batch submission:", error);
      toast.error("Error submitting all answers.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-4">
      <button onClick={handleSubmitAll} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit All"}
      </button>
    </div>
  );
}
