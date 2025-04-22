import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  console.log("Starting upload for file:", file.name);
  try {
    // Create the S3 client
    const s3 = new S3({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Generate a unique file key
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");
    console.log("Generated file key:", file_key);

    // Convert the file to a Uint8Array (avoids issues with streams)
    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);
    console.log("Converted file to Uint8Array");

    const params = { 
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: file_key,
      Body: body,
    };
    console.log("Uploading with parameters:", params);

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err: any, data: PutObjectCommandOutput | undefined) => {
        if (err) {
          console.error("Error uploading to S3:", err);
          return reject(err);
        }
        console.log("Successfully uploaded to S3:", file_key, data);
        return resolve({
          file_key,
          file_name: file.name,
        });
      });
    });
  } catch (error) {
    console.error("Caught error during upload:", error);
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;
  return url;
}
