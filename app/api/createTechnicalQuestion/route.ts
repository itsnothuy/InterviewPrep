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
// File: app/api/createTechnicalQuestion/route.ts

import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { TechnicalQuestions } from "@/utils/schema";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    // Define the expected payload.
    const schema = z.object({
      mockIdRef: z.string(),
      questions: z.array(
        z.object({
          questionText: z.string(),
          difficulty: z.string().optional(),
        })
      ),
    });
    const { mockIdRef, questions } = schema.parse(await request.json());

    // Aggregate the questions into a JSON string.
    const jsonTechQuestions = JSON.stringify(questions);

    // Insert a single row into the new table.
    await db.insert(TechnicalQuestions).values({
      mockIdRef,
      jsonTechQuestions,
    }).execute();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating technical questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
