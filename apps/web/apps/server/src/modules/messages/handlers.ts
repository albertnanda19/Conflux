import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { messagesQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = messagesQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPesan(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPesan(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPesanService(body)
  return successResponse(item, "Pesan berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePesanService(id, body)
  return successResponse(item, "Pesan berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePesanService(id)
  return successResponse(null, "Pesan berhasil dihapus")
}
