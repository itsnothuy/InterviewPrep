// import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

// export async function uploadToS3(
//   file: File
// ): Promise<{ file_key: string; file_name: string }> {
//   console.log("Starting upload for file:", file.name);
//   try {
//     // Create the S3 client
//     const s3 = new S3({
//       region: "us-east-2",
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       },
//     });

//     // Generate a unique file key
//     const file_key =
//       "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
//     console.log("Generated file key:", file_key);

//     // Convert the file to a Uint8Array (avoids issues with streams)
//     const arrayBuffer = await file.arrayBuffer();
//     const body = new Uint8Array(arrayBuffer);
//     console.log("Converted file to Uint8Array");

//     const params = { 
//       Bucket: process.env.S3_BUCKET_NAME!,
//       Key: file_key,
//       Body: body,
//     };
//     console.log("Uploading with parameters:", params);

//     return new Promise((resolve, reject) => {
//       s3.putObject(params, (err: any, data: PutObjectCommandOutput | undefined) => {
//         if (err) {
//           console.error("Error uploading to S3:", err);
//           return reject(err);
//         }
//         console.log("Successfully uploaded to S3:", file_key, data);
//         return resolve({
//           file_key,
//           file_name: file.name,
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Caught error during upload:", error);
//     throw error;
//   }
// }

// export function getS3Url(file_key: string) {
//   const url = `https://${process.env.S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;
//   return url;
// }

// app/s3.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const REGION = "us‑east‑2";
const BUCKET = process.env.S3_BUCKET_NAME!;
if (!BUCKET) throw new Error("Missing S3_BUCKET_NAME env var");

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  console.log("[S3] Starting uploadToS3");
  console.log("[S3] Region:", REGION);
  console.log("[S3] Bucket:", BUCKET);
  console.log("[S3] File:", { name: file.name, type: file.type, size: file.size });

  // 1) generate your key
  const timestamp = Date.now();
  const sanitized = file.name.replace(/\s+/g, "-");
  const file_key = `uploads/${timestamp}-${sanitized}`;
  console.log("[S3] Generated file_key:", file_key);

  // 2) convert to Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const body = new Uint8Array(arrayBuffer);
  console.log("[S3] Converted file to Uint8Array, length:", body.length);

  // 3) prepare command
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: file_key,
    Body: body,
    ContentType: file.type,
  });
  console.log("[S3] PutObjectCommand params:", {
    Bucket: cmd.input.Bucket,
    Key: cmd.input.Key,
    ContentType: cmd.input.ContentType,
    BodyLength: body.length,
  });

  try {
    const result = await s3.send(cmd);
    console.log("[S3] Upload successful:", result);
    return { file_key, file_name: file.name };
  } catch (err) {
    console.error("[S3] Upload failed:", err);
    throw err;
  }
}

export function getS3Url(file_key: string): string {
  const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${file_key}`;
  console.log("[S3] Generated URL:", url);
  return url;
}
