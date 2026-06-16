import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { settingsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = settingsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPengaturan(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPengaturan(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPengaturanService(body)
  return successResponse(item, "Pengaturan berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePengaturanService(id, body)
  return successResponse(item, "Pengaturan berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePengaturanService(id)
  return successResponse(null, "Pengaturan berhasil dihapus")
}
