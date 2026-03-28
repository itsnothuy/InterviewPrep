import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { interviewId: string } }) {
  try {
    // SEC-003 FIX: Add authentication check
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SEC-003 FIX: Verify interview ownership
    const interview = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId));

    if (!interview || interview.length === 0) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    if (interview[0].createdBy !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You do not have access to this interview" },
        { status: 403 }
      );
    }

    // Query the UserAnswer table for behavioral feedback associated with this interview.
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    
    return NextResponse.json({ feedback: result });
  } catch (error) {
    console.error("Error fetching behavioral feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
