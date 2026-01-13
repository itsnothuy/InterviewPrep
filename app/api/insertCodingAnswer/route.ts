// File: app/api/insertCodingAnswer/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { UserCodingAnswer, MockInterview } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import moment from "moment";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse,
  forbiddenResponse 
} from "@/lib/server/auth";

const requestSchema = z.object({
  mockIdRef: z.string().min(1),
  questionId: z.number().int(),
  questionText: z.string().min(1),
  userCode: z.string().min(1),
  feedback: z.string().optional(),
  rating: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Missing or invalid required fields");
    }
    
    const { mockIdRef, questionId, questionText, userCode, feedback, rating } = parsed.data;

    // Verify the interview belongs to this user
    const interview = await db
      .select()
      .from(MockInterview)
      .where(and(
        eq(MockInterview.mockId, mockIdRef),
        eq(MockInterview.createdBy, session.user.id)
      ))
      .limit(1);
    
    if (interview.length === 0) {
      return forbiddenResponse("Interview not found or access denied");
    }

    const result = await db.insert(UserCodingAnswer).values({
      mockIdRef,
      questionId,
      questionText,
      userCode,
      feedback: feedback || null,
      rating: rating || null,
      createdBy: session.user.id,
      createdAt: moment().format("DD-MM-yyyy"),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error inserting coding answer:", error);
    return serverErrorResponse();
  }
}
