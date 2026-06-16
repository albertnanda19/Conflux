import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { analyticsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = analyticsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listAnalitik(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getAnalitik(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createAnalitikService(body)
  return successResponse(item, "Analitik berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updateAnalitikService(id, body)
  return successResponse(item, "Analitik berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deleteAnalitikService(id)
  return successResponse(null, "Analitik berhasil dihapus")
}
