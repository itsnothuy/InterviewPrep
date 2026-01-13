import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { startGeminiChat } from "@/lib/server/gemini";
import { z } from "zod";

const requestSchema = z.object({
  questionText: z.string().min(1),
  difficulty: z.string().min(1),
  userCode: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { questionText, difficulty, userCode } = parsed.data;

    const codeFeedbackPrompt = `
Question: "${questionText}"
Difficulty: ${difficulty}
User's code:
\`\`\`
${userCode}
\`\`\`
Please evaluate the code for correctness, efficiency, and clarity.
Return a JSON response with "rating" (1-10) and "feedback" (a short review) only.
`;

    const chatSession = startGeminiChat();
    const aiResult = await chatSession.sendMessage(codeFeedbackPrompt);
    const responseText = await aiResult.response.text();

    // Parse the AI response
    const parsed_response = JSON.parse(
      responseText.replace(/```json/g, "").replace(/```/g, "").trim()
    );

    return NextResponse.json({
      rating: parsed_response.rating || "",
      feedback: parsed_response.feedback || "",
    });
  } catch (error) {
    console.error("Error generating code feedback:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}
