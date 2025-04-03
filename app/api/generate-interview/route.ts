// app/api/generate-interview/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { chatSession } from "@/utils/GeminiAIModal";
import { getContext } from "@/app/context";

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

    // Construct the enhanced prompt including resume data
    const prompt = `
      Job position: ${role},
      Job Description: ${description},
      Years of Experience: ${experience}.
      Resume Data: ${resumeContext}
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
