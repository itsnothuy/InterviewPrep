// import { S3 } from "@aws-sdk/client-s3";
// import fs from "fs";
// export async function downloadFromS3(file_key: string): Promise<string> {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const s3 = new S3({
//         region: "us-east-2",
//         credentials: {
//           accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//         },
//       });
//       const params = {
//         Bucket: process.env.S3_BUCKET_NAME!,
//         Key: file_key,
//       };

//       const obj = await s3.getObject(params);
//       const file_name = `/Users/huy/Desktop/interview/tmp/pdf/${Date.now().toString()}.pdf`;

//       if (obj.Body instanceof require("stream").Readable) {
//         const file = fs.createWriteStream(file_name);
//         file.on("open", function (fd) {
//           // @ts-ignore
//           obj.Body?.pipe(file).on("finish", () => {
//             return resolve(file_name);
//           });
//         });

//       }
//     } catch (error) {
//       console.error(error);
//       reject(error);
//       return null;
//     }
//   });
// }


// Production code 
// File: app/s3.ts  (or wherever your download helper lives)

// app/s3-server.ts

import { S3 } from "@aws-sdk/client-s3";
import fs from "fs";
import os from "os";
import path from "path";

export async function downloadFromS3(file_key: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "us-east-2",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      const params = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: file_key,
      };
      const obj = await s3.getObject(params);

      // ← use the system temp dir instead of a hard‑coded path
      const tmpDir = os.tmpdir();
      const file_name = path.join(tmpDir, `${Date.now().toString()}.pdf`);

      // same stream‑to‑file logic
      if (obj.Body instanceof require("stream").Readable) {
        const file = fs.createWriteStream(file_name);
        file.on("open", function (fd) {
          (obj.Body as NodeJS.ReadableStream)
            .pipe(file)
            .on("finish", () => resolve(file_name))
            .on("error", (err: any) => reject(err));
        });
        file.on("error", (err) => reject(err));
      } else {
        reject(new Error("S3 object body was not a readable stream"));
      }
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}
