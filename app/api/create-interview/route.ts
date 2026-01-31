// app/api/create-interview/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

export async function POST(request: Request) {
  try {
    // SEC-003 FIX: Check authentication
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      jsonMockResp,
      jobPosition,
      jobDescription,
      jobExperience,
      resumeFile,
    } = body;

    // Validate required fields
    if (!jsonMockResp || !jobPosition || !jobDescription || !jobExperience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SEC-002 FIX: Database operation happens server-side
    const mockId = uuidv4();
    const resp = await db
      .insert(MockInterview)
      .values({
        mockId,
        jsonMockResp,
        jobPosition,
        jobDescription,
        jobExperience,
        createdBy: session.user.id,
        createdAt: moment().format("DD-MM-yyyy"),
        resumeFile: resumeFile || null,
      })
      .returning({ mockId: MockInterview.mockId });

    if (!resp || resp.length === 0) {
      return NextResponse.json(
        { error: "Failed to create interview" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mockId: resp[0].mockId,
    });
  } catch (error) {
    console.error("Error creating interview:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
