import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { searchQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = searchQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPencarian(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPencarian(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPencarianService(body)
  return successResponse(item, "Pencarian berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePencarianService(id, body)
  return successResponse(item, "Pencarian berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePencarianService(id)
  return successResponse(null, "Pencarian berhasil dihapus")
}
