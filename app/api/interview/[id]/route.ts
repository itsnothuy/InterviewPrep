// app/api/interview/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { eq, and } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';
import { 
  requireAuth, 
  unauthorizedResponse, 
  serverErrorResponse,
  forbiddenResponse 
} from "@/lib/server/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    
    // Query with ownership check (createdBy must match session user)
    const result = await db
      .select()
      .from(MockInterview)
      .where(and(
        eq(MockInterview.mockId, params.id),
        eq(MockInterview.createdBy, session.user.id)
      ));
    
    if (!result || result.length === 0) {
      return forbiddenResponse('Interview not found or access denied');
    }
    
    let jsonString = result[0].jsonMockResp;
    // Clean up the JSON string if needed:
    const closingBracketIndex = jsonString.lastIndexOf("}]");
    if (closingBracketIndex !== -1) {
      jsonString = jsonString.substring(0, closingBracketIndex + 2);
    }
    jsonString = jsonString
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\\n/g, "")
      .replace(/\r/g, "")
      .trim();
    
    const jsonMockResponse = JSON.parse(jsonString);
    return NextResponse.json({ interviewData: result[0], mockQuestions: jsonMockResponse });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error fetching interview details:", error);
    return serverErrorResponse();
  }
}
