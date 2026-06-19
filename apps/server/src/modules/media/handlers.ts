import { randomUUID } from "node:crypto"
import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse, BadRequestError } from "@/lib/errors"
import { uploadFile } from "@/lib/storage"

const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED_PREFIX = ["image/", "video/", "audio/"]
const ALLOWED_EXACT = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/csv"]

function contentTypeOf(mime: string): "image" | "video" | "audio" | "document" {
  if (mime.startsWith("image/")) return "image"
  if (mime.startsWith("video/")) return "video"
  if (mime.startsWith("audio/")) return "audio"
  return "document"
}

function isAllowed(mime: string): boolean {
  return ALLOWED_PREFIX.some((p) => mime.startsWith(p)) || ALLOWED_EXACT.includes(mime)
}

export async function handleUploadMedia(auth: JwtPayload | null, body: unknown) {
  requireAuth(auth)
  const file = (body as { file?: File } | null)?.file
  if (!file || typeof file === "string") throw new BadRequestError("File tidak ditemukan dalam permintaan.")
  if (file.size > MAX_SIZE) throw new BadRequestError("Ukuran file melebihi batas 10MB.")
  if (!isAllowed(file.type)) throw new BadRequestError(`Tipe file tidak didukung: ${file.type}`)

  const buffer = Buffer.from(await file.arrayBuffer())
  const safeName = file.name.replace(/[^\w.\-]/g, "_")
  const key = `chat/${randomUUID()}/${safeName}`
  const url = await uploadFile(key, buffer, file.type)

  return successResponse(
    {
      url,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      contentType: contentTypeOf(file.type),
    },
    "File berhasil diunggah.",
  )
}
