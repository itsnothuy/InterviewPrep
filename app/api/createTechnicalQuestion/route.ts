// // File: app/api/createTechnicalQuestion/route.ts

// import { NextResponse } from "next/server";
// import { db } from "@/utils/db";
// import { TechnicalQuestion } from "@/utils/schema";

// export async function POST(request: Request) {
//   try {
//     const { mockIdRef, questions } = await request.json();
//     console.log("POST /api/createTechnicalQuestion:");
//     console.log(" -> mockIdRef from body:", mockIdRef);
//     console.log(" -> questions array:", questions);

//     for (const q of questions) {
//       await db
//         .insert(TechnicalQuestion)
//         .values({
//           mockIdRef: mockIdRef,
//           questionText: q.questionText,
//           difficulty: q.difficulty,
//         })
//         .execute();

//       console.log(" -> Inserted technical question with mockIdRef=", mockIdRef);
//       console.log(" -> questionText =", q.questionText);
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("Error in POST /api/createTechnicalQuestion:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// File: app/api/createTechnicalQuestion/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { TechnicalQuestions, MockInterview } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse,
  forbiddenResponse 
} from "@/lib/server/auth";

const requestSchema = z.object({
  mockIdRef: z.string().min(1),
  questions: z.array(
    z.object({
      questionText: z.string(),
      difficulty: z.string().optional(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid request body: " + parsed.error.message);
    }
    
    const { mockIdRef, questions } = parsed.data;

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

    // Aggregate the questions into a JSON string.
    const jsonTechQuestions = JSON.stringify(questions);

    // Insert a single row into the new table.
    await db.insert(TechnicalQuestions).values({
      mockIdRef,
      jsonTechQuestions,
    }).execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error creating technical questions:", error);
    return serverErrorResponse();
  }
}
