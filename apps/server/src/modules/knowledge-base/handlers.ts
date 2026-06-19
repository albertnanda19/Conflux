import { randomUUID } from "node:crypto"
import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse, paginatedResponse, BadRequestError } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { uploadFile } from "@/lib/storage"
import { listKbQuerySchema, updateKbSchema } from "./types"
import * as service from "./services"

const MAX_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ["pdf", "docx", "txt", "csv"]

function fileExtension(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? ""
}

export async function handleListKb(auth: JwtPayload | null, query: unknown) {
  requireAuth(auth)
  const parsed = parseSafe(listKbQuerySchema, query)
  const result = await service.listDocuments(parsed)
  return paginatedResponse(result.data, result.meta.total, result.meta.page, result.meta.limit, "Daftar dokumen berhasil diambil.")
}

export async function handleGetKb(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.getDocument(id), "Detail dokumen berhasil diambil.")
}

export async function handleUploadKb(auth: JwtPayload | null, body: unknown) {
  const user = requireAuth(auth)
  const data = body as { file?: File; title?: string; category?: string; aiAssistantId?: string } | null
  const file = data?.file
  if (!file || typeof file === "string") throw new BadRequestError("File tidak ditemukan dalam permintaan.")
  if (file.size > MAX_SIZE) throw new BadRequestError("Ukuran file melebihi batas 10MB.")

  const fileType = fileExtension(file.name)
  if (!ALLOWED_TYPES.includes(fileType)) throw new BadRequestError(`Tipe file tidak didukung: ${fileType || "tidak diketahui"}. Gunakan PDF, DOCX, TXT, atau CSV.`)

  const title = data?.title?.trim() || file.name
  const buffer = Buffer.from(await file.arrayBuffer())
  const safeName = file.name.replace(/[^\w.\-]/g, "_")
  const storageKey = `kb/${randomUUID()}/${safeName}`
  const originalFileUrl = await uploadFile(storageKey, buffer, file.type || "application/octet-stream")

  const doc = await service.createDocument({
    title,
    category: data?.category?.trim() || null,
    aiAssistantId: data?.aiAssistantId || null,
    fileType,
    fileSize: file.size,
    originalFileUrl,
    storageKey,
    createdBy: user.sub,
    createdByName: user.email,
  })

  return successResponse(doc, "Dokumen berhasil diunggah dan sedang diproses.")
}

export async function handleUpdateKb(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(updateKbSchema, body)
  return successResponse(await service.updateDocument(id, input), "Dokumen berhasil diperbarui.")
}

export async function handleDeleteKb(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  await service.deleteDocument(id)
  return successResponse({ id }, "Dokumen berhasil dihapus.")
}
