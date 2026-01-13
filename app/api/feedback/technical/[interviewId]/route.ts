import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { UserCodingAnswer, MockInterview } from "@/utils/schema";
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
    
    // Query the UserCodingAnswer table for technical feedback related to this interview.
    const result = await db
      .select()
      .from(UserCodingAnswer)
      .where(eq(UserCodingAnswer.mockIdRef, params.interviewId))
      .orderBy(UserCodingAnswer.id);

    return NextResponse.json({ feedback: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error fetching technical feedback:", error);
    return serverErrorResponse();
  }
}
