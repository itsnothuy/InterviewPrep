/**
 * Server-only S3 client with presigned URL support.
 * This module MUST NOT be imported from client components.
 */
import "server-only";

import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand 
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import os from "os";
import path from "path";

// Validate required env vars at module load
const requiredEnvVars = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(
      `${key} environment variable is not set. ` +
      "Please add it to your .env file."
    );
  }
}

const s3Client = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const bucketName = process.env.S3_BUCKET_NAME!;

/**
 * Generate a presigned URL for uploading a file to S3.
 * The client can use this URL to upload directly to S3 without needing AWS credentials.
 */
export async function getPresignedUploadUrl(
  key: string, 
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading a file from S3.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Upload a file buffer directly to S3 (server-side upload).
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(command);
}

/**
 * Download a file from S3 to a temporary location.
 * Returns the local file path.
 */
export async function downloadFromS3(fileKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  const response = await s3Client.send(command);
  
  if (!response.Body) {
    throw new Error("S3 object body was empty");
  }

  // Create temp file path
  const tmpDir = os.tmpdir();
  const fileName = path.join(tmpDir, `${Date.now()}.pdf`);

  // Convert stream to buffer and write to file
  const chunks: Uint8Array[] = [];
  for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  fs.writeFileSync(fileName, buffer);

  return fileName;
}

/**
 * Generate the public S3 URL for a file.
 * Note: This URL is only accessible if the bucket allows public access.
 */
export function getS3Url(fileKey: string): string {
  return `https://${bucketName}.s3.us-east-2.amazonaws.com/${fileKey}`;
}

/**
 * Generate a unique file key for uploads.
 */
export function generateFileKey(fileName: string): string {
  const sanitizedName = fileName.replace(/\s+/g, "-");
  return `uploads/${Date.now()}-${sanitizedName}`;
}

/**
 * Get the S3 client for advanced operations.
 */
export function getS3Client(): S3Client {
  return s3Client;
}

export { bucketName };
