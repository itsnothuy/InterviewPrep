// import { loadS3IntoPinecone } from "@/utils/pinecone";
// import { getS3Url } from "@/app/s3";
// import { authConfig } from "@/lib/auth";
// import { db } from "@/utils/db";
// import { chats } from "@/utils/schema";
// import { getServerSession } from "next-auth";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authConfig);
//     console.log("Create-chat session:", session);

//     const userId = session?.user?.id;
//     if (!userId) {
//       throw new Error("User ID is missing in session");
//     }
    
//     const body = await req.json();
//     const { file_key, file_name } = body;
//     await loadS3IntoPinecone(file_key);

//     const chat_id = await db
//       .insert(chats)
//       .values({
//         fileKey: file_key,
//         pdfName: file_name,
//         pdfUrl: getS3Url(file_key),
//         //##TODO: replace with actual user id from Clerk/OAuth
//         userId: userId as string,
//       })
//       .returning({
//         insertedId: chats.id,
//       });

//     return NextResponse.json(
//       { chat_id: chat_id[0].insertedId },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "internal server error" },
//       { status: 500 }
//     );
//   }
// }

// File: app/api/create-chat/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { db } from "@/utils/db";
import { chats } from "@/utils/schema";
import { loadS3IntoPinecone } from "@/utils/pinecone";
import { getS3Url } from "@/app/s3";

export async function POST(req: Request) {
  try {
    // 1. Validate session
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Parse body
    const { file_key, file_name } = await req.json();
    if (!file_key || !file_name) {
      return NextResponse.json(
        { error: "Missing file_key or file_name" },
        { status: 400 }
      );
    }

    // 3. Load into Pinecone
    await loadS3IntoPinecone(file_key);

    // 4. Insert into the DB
    const [inserted] = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: session.user.id,
      })
      .returning({ chat_id: chats.id });

    // 5. Respond
    return NextResponse.json({ chat_id: inserted.chat_id });
  } catch (err) {
    console.error("create-chat error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
