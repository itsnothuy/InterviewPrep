// app/api/interview/[id]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.id));
    
    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
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
    console.error("Error fetching interview details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
