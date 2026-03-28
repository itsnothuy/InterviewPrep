// File: app/api/generate-technical-question/route.ts
import { NextResponse } from "next/server";
import { chatSession } from "@/utils/GeminiAIModal";
import { z } from "zod";
import { sanitizeForPrompt } from "@/utils/sanitize";

// Define the request body schema for generating technical questions.
const techRequestSchema = z.object({
  role: z.string(),
  description: z.string(),
  experience: z.string(),
  mockId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, description, experience, mockId } = techRequestSchema.parse(body);

    // SEC-004 FIX: Sanitize user inputs before constructing AI prompt
    const sanitizedRole = sanitizeForPrompt(role, 200);
    const sanitizedDescription = sanitizeForPrompt(description, 2000);
    const sanitizedExperience = sanitizeForPrompt(experience, 50);

    const technicalPrompt = `
Using the following job context:
Job Role: ${sanitizedRole}
Job Description: ${sanitizedDescription}
Years of Experience: ${sanitizedExperience}
Generate 2 LeetCode-style technical interview questions in JSON format.
Each question should include "questionText" and "difficulty" (one of "easy", "medium", or "hard").
Return only the JSON array.
`;
    const techResult = await chatSession.sendMessage(technicalPrompt);
    const techResponseText = await techResult.response.text();
    const generatedTechQuestions = JSON.parse(
      techResponseText.replace(/```json/g, "").replace(/```/g, "").trim()
    );

    return NextResponse.json({ success: true, generatedTechQuestions });
  } catch (error) {
    console.error("Error generating technical questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
