import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserCodingAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { interviewId: string } }) {
  try {
    // Query the UserCodingAnswer table for technical feedback related to this interview.
    const result = await db
      .select()
      .from(UserCodingAnswer)
      .where(eq(UserCodingAnswer.mockIdRef, params.interviewId))
      .orderBy(UserCodingAnswer.id);

    return NextResponse.json({ feedback: result });
  } catch (error) {
    console.error("Error fetching technical feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
