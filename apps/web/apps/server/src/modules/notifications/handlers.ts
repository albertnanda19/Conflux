import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { notificationsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = notificationsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPemberitahuan(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPemberitahuan(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPemberitahuanService(body)
  return successResponse(item, "Pemberitahuan berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePemberitahuanService(id, body)
  return successResponse(item, "Pemberitahuan berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePemberitahuanService(id)
  return successResponse(null, "Pemberitahuan berhasil dihapus")
}
