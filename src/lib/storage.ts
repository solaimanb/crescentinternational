import "server-only";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const MEDIA_BUCKET = "c1-media";

export const s3 = new S3Client({
  forcePathStyle: true,
});

export function mediaUrl(key: string): string {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  if (!endpoint) {
    throw new Error("AWS_ENDPOINT_URL_S3 is not set");
  }

  return `${endpoint.replace(/\/$/, "")}/${MEDIA_BUCKET}/${key.replace(/^\//, "")}`;
}

export async function uploadMediaFile(file: File, prefix: string): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const key = `${prefix}/${crypto.randomUUID()}.${extension}`;
  const body = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: MEDIA_BUCKET,
      Key: key,
      Body: body,
      ContentType: file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return mediaUrl(key);
}
