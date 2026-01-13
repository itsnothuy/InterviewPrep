// app/api/feedback/generate/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { startGeminiChat } from "@/lib/server/gemini";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse 
} from "@/lib/server/auth";

const requestSchema = z.object({
  question: z.string().min(1),
  userAnswer: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Require authentication
    await requireAuth();
    
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid request body: " + parsed.error.message);
    }
    
    const { question, userAnswer } = parsed.data;

    const feedbackPrompt = `Question: ${question}, User answer: ${userAnswer}, Based on the question and the user answer, please rate the answer and give feedback for improvement in 3-5 lines, in JSON format with fields 'rating' and 'feedback'.`;

    const chatSession = startGeminiChat();
    const result = await chatSession.sendMessage(feedbackPrompt);
    const responseText = result.response.text();
    
    const cleanedResponse = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .trim();

    try {
      const feedbackJson = JSON.parse(cleanedResponse);
      return NextResponse.json({ 
        success: true, 
        rating: feedbackJson.rating,
        feedback: feedbackJson.feedback 
      });
    } catch {
      return NextResponse.json({ 
        success: true, 
        rating: "N/A",
        feedback: cleanedResponse 
      });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error generating feedback:", error);
    return serverErrorResponse();
  }
}
