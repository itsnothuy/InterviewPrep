// File: app/api/generate-technical-question/route.ts
import { NextResponse } from "next/server";
import { startGeminiChat } from "@/lib/server/gemini";
import { z } from "zod";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse 
} from "@/lib/server/auth";

// Define the request body schema for generating technical questions.
const techRequestSchema = z.object({
  role: z.string().min(1),
  description: z.string().min(1),
  experience: z.string().min(1),
  mockId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Require authentication
    await requireAuth();
    
    const body = await req.json();
    const parsed = techRequestSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid request body: " + parsed.error.message);
    }
    
    const { role, description, experience, mockId } = parsed.data;

    const technicalPrompt = `
Using the following job context:
Job Role: ${role}
Job Description: ${description}
Years of Experience: ${experience}
Generate 2 LeetCode-style technical interview questions in JSON format.
Each question should include "questionText" and "difficulty" (one of "easy", "medium", or "hard").
Return only the JSON array.
`;
    const chatSession = startGeminiChat();
    const techResult = await chatSession.sendMessage(technicalPrompt);
    const techResponseText = await techResult.response.text();
    const generatedTechQuestions = JSON.parse(
      techResponseText.replace(/```json/g, "").replace(/```/g, "").trim()
    );

    return NextResponse.json({ success: true, generatedTechQuestions });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error generating technical questions:", error);
    return serverErrorResponse();
  }
}
