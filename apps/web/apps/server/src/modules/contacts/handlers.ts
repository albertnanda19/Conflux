import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { contactsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = contactsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listKontak(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getKontak(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createKontakService(body)
  return successResponse(item, "Kontak berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updateKontakService(id, body)
  return successResponse(item, "Kontak berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deleteKontakService(id)
  return successResponse(null, "Kontak berhasil dihapus")
}
