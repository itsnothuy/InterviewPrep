// app/api/interviews/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { MockInterview } from "@/utils/schema";
import { requireAuth, unauthorizedResponse, serverErrorResponse, badRequestResponse } from "@/lib/server/auth";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const createInterviewSchema = z.object({
  jsonMockResp: z.string(),
  jobPosition: z.string().min(1),
  jobDescription: z.string().min(1),
  jobExperience: z.string().min(1),
  resumeFile: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    
    const body = await req.json();
    const parsed = createInterviewSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid request body: " + parsed.error.message);
    }
    
    const { jsonMockResp, jobPosition, jobDescription, jobExperience, resumeFile } = parsed.data;
    
    const mockId = uuidv4();
    
    const result = await db
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
    
    if (!result[0]?.mockId) {
      return serverErrorResponse("Failed to create interview");
    }
    
    return NextResponse.json({ 
      success: true, 
      mockId: result[0].mockId 
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error creating interview:", error);
    return serverErrorResponse();
  }
}
