// // File: app/api/technicalQuestion/[mockId]/route.ts

// import { NextResponse } from 'next/server';
// import { db } from '@/utils/db';
// import { TechnicalQuestion } from '@/utils/schema';
// import { eq } from 'drizzle-orm';

// export async function GET(request: Request, { params }: { params: { mockId: string } }) {
//   try {
//     console.log("GET /api/technicalQuestion called with param.mockId =", params.mockId);

    // // Debug Step 1: Log all rows in the technical_question table.
    // const allRows = await db.select().from(TechnicalQuestion).execute();
    // console.log("All rows in 'technical_question' table:", allRows);

    // // Debug Step 2: Log the intended query details.
    // console.log("Performing query with condition: eq(TechnicalQuestion.mockIdRef, params.mockId)");
    
//     // Execute the WHERE query using the provided mockId value.
//     const results = await db
//       .select()
//       .from(TechnicalQuestion)
//       .where(eq(TechnicalQuestion.mockIdRef, params.mockId))
//       .execute();

//     // Debug Step 3: Log the query results.
//     console.log("Query results for mockId =", params.mockId, ":", results);

//     return NextResponse.json({ technicalQuestions: results });
//   } catch (error) {
//     console.error("Error in GET /api/technicalQuestion:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }


// File: app/api/technicalQuestion/[mockId]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { TechnicalQuestions } from "@/utils/schema";
import { eq } from "drizzle-orm";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Normalize the route parameter by trimming and converting to lower-case.
    const normalizedParam = params.id.trim().toLowerCase();
    console.log("DEBUG: Normalized route parameter:", normalizedParam);
    // Fetch the row using the normalized parameter.
    const result = await db
      .select()
      .from(TechnicalQuestions)
      .where(eq(TechnicalQuestions.mockIdRef, normalizedParam));

    if (!result || result.length === 0) {
      console.log("DEBUG: No matching rows found");
      return NextResponse.json(
        { error: "Technical questions not found" },
        { status: 404 }
      );
    }

    let jsonString = result[0].jsonTechQuestions;
    // Clean up the JSON string if needed (if there is any extra formatting)
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

      let technicalQuestions = JSON.parse(jsonString);

      // Ensure each question has an "id" property.
      technicalQuestions = technicalQuestions.map((question: any, index: number) => {
        return {
          id: question.id !== undefined ? question.id : index + 1, // Use existing id or assign index+1
          ...question,
        };
      });
  
    console.log("DEBUG: Fetched technical questions:", technicalQuestions);

    return NextResponse.json({ technicalQuestions });
  } catch (error) {
    console.error("Error fetching technical questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
