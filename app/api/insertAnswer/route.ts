// app/api/insertAnswer/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { UserAnswer, MockInterview } from '@/utils/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import moment from 'moment';
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse,
  forbiddenResponse 
} from "@/lib/server/auth";

const requestSchema = z.object({
  mockIdRef: z.string().min(1),
  question: z.string().min(1),
  correctAns: z.string().optional(),
  userAns: z.string().min(1),
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
    
    const { mockIdRef, question, correctAns, userAns, feedback, rating } = parsed.data;
    
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
    
    const result = await db.insert(UserAnswer).values({
      mockIdRef,
      question,
      correctAns: correctAns || null,
      userAns,
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
    console.error("Error inserting user answer:", error);
    return serverErrorResponse();
  }
}
