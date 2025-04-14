// File: app/api/insertCodingAnswer/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { UserCodingAnswer } from "@/utils/schema";
import moment from "moment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      mockIdRef,
      questionId,
      questionText, 
      userCode,
      feedback,
      rating,
      createdBy,
    } = body;

    // Validate input
    if (!mockIdRef || !questionId || !questionText || !userCode || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await db.insert(UserCodingAnswer).values({
      mockIdRef,
      questionId,
      questionText,
      userCode,
      feedback: feedback || null,
      rating: rating || null,
      createdBy,
      createdAt: moment().format("DD-MM-yyyy"),
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error inserting coding answer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
