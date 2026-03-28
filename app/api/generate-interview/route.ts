// app/api/generate-interview/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { chatSession } from "@/utils/GeminiAIModal";
import { getContext } from "@/app/context";
import { sanitizeForPrompt } from "@/utils/sanitize";

// Define the expected request body schema
const requestSchema = z.object({
  role: z.string(),
  description: z.string(),
  experience: z.string(),
  // Optional: If the user selects an existing resume, its file key is provided.
  resumeFileKey: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { role, description, experience, resumeFileKey } = requestSchema.parse(body);

    // If a resume file key is provided, fetch the resume context from Pinecone
    let resumeContext = "";
    if (resumeFileKey) {
      // Here "Extract full resume" is a sample query; you can adjust this as needed.
      resumeContext = await getContext("Extract full resume", resumeFileKey);
    }

    // SEC-004 FIX: Sanitize user inputs before constructing AI prompt
    const sanitizedRole = sanitizeForPrompt(role, 200);
    const sanitizedDescription = sanitizeForPrompt(description, 2000);
    const sanitizedExperience = sanitizeForPrompt(experience, 50);
    const sanitizedResumeContext = sanitizeForPrompt(resumeContext, 5000);

    // Construct the enhanced prompt including resume data
    const prompt = `
      Job position: ${sanitizedRole},
      Job Description: ${sanitizedDescription},
      Years of Experience: ${sanitizedExperience}.
      Resume Data: ${sanitizedResumeContext}
      Based on this, give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers in JSON format.
    `;

    // Send the prompt to Gemini AI using the chat session
    const result = await chatSession.sendMessage(prompt);

    // Clean the response text (remove markdown formatting, newlines, etc.)
    const output = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\n/g, "")
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .trim();

    // Return the generated output as JSON
    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error generating interview questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
