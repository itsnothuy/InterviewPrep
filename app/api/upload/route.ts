// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { uploadToS3, generateFileKey } from "@/lib/server/s3";
import { 
  requireAuth, 
  unauthorizedResponse, 
  badRequestResponse,
  serverErrorResponse 
} from "@/lib/server/auth";

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    // Require authentication
    await requireAuth();
    
    const form = await req.formData();
    const file = form.get("file") as File | null;
    
    if (!file) {
      return badRequestResponse("No file provided");
    }
    
    // Validate file type
    if (!file.type.includes("pdf")) {
      return badRequestResponse("Only PDF files are allowed");
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return badRequestResponse("File size must be less than 10MB");
    }

    const fileKey = generateFileKey(file.name);
    const body = Buffer.from(await file.arrayBuffer());
    
    await uploadToS3(fileKey, body, file.type);

    // **Return these exact keys** so client.data.file_key/file_name exist
    return NextResponse.json({
      file_key: fileKey,
      file_name: file.name,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error uploading file:", error);
    return serverErrorResponse();
  }
}
