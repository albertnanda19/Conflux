import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { knowledge_baseQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = knowledge_baseQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listBasis Pengetahuan(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getBasis Pengetahuan(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createBasis PengetahuanService(body)
  return successResponse(item, "Basis Pengetahuan berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updateBasis PengetahuanService(id, body)
  return successResponse(item, "Basis Pengetahuan berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deleteBasis PengetahuanService(id)
  return successResponse(null, "Basis Pengetahuan berhasil dihapus")
}
