// app/api/generate-interview/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { startGeminiChat } from "@/lib/server/gemini";
import { getContext } from "@/app/context";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse 
} from "@/lib/server/auth";

// Define the expected request body schema
const requestSchema = z.object({
  role: z.string().min(1),
  description: z.string().min(1),
  experience: z.string().min(1),
  // Optional: If the user selects an existing resume, its file key is provided.
  resumeFileKey: z.string().optional(),
});

// Interview question count (server-side, not exposed to client)
const INTERVIEW_QUESTION_COUNT = process.env.INTERVIEW_QUESTION_COUNT || "5";

export async function POST(req: Request) {
  try {
    // Require authentication
    await requireAuth();
    
    // Parse the request body
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid request body: " + parsed.error.message);
    }
    
    const { role, description, experience, resumeFileKey } = parsed.data;

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
      Based on this, give us ${INTERVIEW_QUESTION_COUNT} interview questions and answers in JSON format.
    `;

    // Send the prompt to Gemini AI using the chat session (server-only)
    const chatSession = startGeminiChat();
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
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error generating interview questions:", error);
    return serverErrorResponse();
  }
}
