import { Client as MinioClient } from "minio"
import { InternalError } from "./errors"

const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
})

const BUCKET_NAME = process.env.MINIO_BUCKET || "dbb-psc-media"

export function buildPublicUrl(key: string): string {
  const base = process.env.MEDIA_PUBLIC_BASE_URL
  if (base) return `${base.replace(/\/+$/, "")}/${key}`
  const useSSL = process.env.MINIO_USE_SSL === "true"
  const endpoint = process.env.MINIO_ENDPOINT || "localhost"
  const port = Number(process.env.MINIO_PORT) || 9000
  return `${useSSL ? "https" : "http"}://${endpoint}:${port}/${BUCKET_NAME}/${key}`
}

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
    return buildPublicUrl(key)
  } catch {
    throw new InternalError("Gagal mengunggah file ke penyimpanan.")
  }
}

export async function downloadFile(key: string): Promise<Buffer> {
  try {
    const stream = await minioClient.getObject(BUCKET_NAME, key)
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(chunk as Buffer)
    return Buffer.concat(chunks)
  } catch {
    throw new InternalError("Gagal mengunduh file dari penyimpanan.")
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
