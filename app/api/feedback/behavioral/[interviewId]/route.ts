import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { interviewId: string } }) {
  try {
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
