// app/api/insertAnswer/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mockIdRef, question, correctAns, userAns, feedback, rating, createdBy } = body;
    
    // Ensure required fields exist
    if (!mockIdRef || !question || !userAns) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const result = await db.insert(UserAnswer).values({
      mockIdRef,
      question,
      correctAns,
      userAns,
      feedback,
      rating,
      createdBy,
      createdAt: moment().format("DD-MM-yyyy"),
    });
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error inserting user answer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
