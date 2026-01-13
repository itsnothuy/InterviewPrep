// app/api/upload/presign/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { 
  getPresignedUploadUrl, 
  generateFileKey, 
  getS3Url 
} from "@/lib/server/s3";
import { 
  requireAuth, 
  unauthorizedResponse, 
  serverErrorResponse, 
  badRequestResponse 
} from "@/lib/server/auth";

const presignSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Require authentication
    await requireAuth();
    
    const body = await req.json();
    const parsed = presignSchema.safeParse(body);
    
    if (!parsed.success) {
      return badRequestResponse("Invalid request body: " + parsed.error.message);
    }
    
    const { fileName, contentType } = parsed.data;
    
    // Validate content type (only allow PDFs for now)
    if (!contentType.includes("pdf")) {
      return badRequestResponse("Only PDF files are allowed");
    }
    
    // Generate a unique file key
    const fileKey = generateFileKey(fileName);
    
    // Get presigned URL for upload
    const presignedUrl = await getPresignedUploadUrl(fileKey, contentType);
    
    // Return the presigned URL and file info
    return NextResponse.json({
      presignedUrl,
      fileKey,
      fileName,
      fileUrl: getS3Url(fileKey),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return unauthorizedResponse();
    }
    console.error("Error generating presigned URL:", error);
    return serverErrorResponse();
  }
}
