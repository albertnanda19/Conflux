import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { channelsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = channelsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listSaluran(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getSaluran(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createSaluranService(body)
  return successResponse(item, "Saluran berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updateSaluranService(id, body)
  return successResponse(item, "Saluran berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deleteSaluranService(id)
  return successResponse(null, "Saluran berhasil dihapus")
}
