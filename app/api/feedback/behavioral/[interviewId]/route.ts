import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { 
  requireAuth, 
  unauthorizedResponse, 
  serverErrorResponse,
  forbiddenResponse 
} from "@/lib/server/auth";

export async function GET(request: Request, { params }: { params: { interviewId: string } }) {
  try {
    const session = await requireAuth();
    
    // First verify the interview belongs to this user
    const interview = await db
      .select()
      .from(MockInterview)
      .where(and(
        eq(MockInterview.mockId, params.interviewId),
        eq(MockInterview.createdBy, session.user.id)
      ))
      .limit(1);
    
    if (interview.length === 0) {
      return forbiddenResponse("Interview not found or access denied");
    }
    
    // Query the UserAnswer table for behavioral feedback associated with this interview.
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    
    return NextResponse.json({ feedback: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error fetching behavioral feedback:", error);
    return serverErrorResponse();
  }
}
