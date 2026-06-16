import { Client as MinioClient } from "minio"
import { InternalError } from "./errors"

const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
})

const BUCKET_NAME = process.env.MINIO_BUCKET || "dbb-psc-media"

export async function ensureBucket(): Promise<void> {
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME, "us-east-1")
    const policy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    })
    await minioClient.setBucketPolicy(BUCKET_NAME, policy)
  }
}

export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  try {
    await minioClient.putObject(BUCKET_NAME, key, buffer, buffer.length, {
      "Content-Type": contentType,
    })
    return `${process.env.MINIO_ENDPOINT || "localhost"}:${process.env.MINIO_PORT || 9000}/${BUCKET_NAME}/${key}`
  } catch {
    throw new InternalError("Gagal mengunggah file ke penyimpanan.")
  }
}

export async function getPresignedUrl(key: string): Promise<string> {
  try {
    return await minioClient.presignedGetObject(BUCKET_NAME, key, 3600)
  } catch {
    throw new InternalError("Gagal membuat tautan unduh file.")
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    await minioClient.removeObject(BUCKET_NAME, key)
  } catch {
    throw new InternalError("Gagal menghapus file dari penyimpanan.")
  }
}

export { minioClient, BUCKET_NAME }
