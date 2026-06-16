import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { usersQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = usersQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPengguna(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPengguna(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPenggunaService(body)
  return successResponse(item, "Pengguna berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePenggunaService(id, body)
  return successResponse(item, "Pengguna berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePenggunaService(id)
  return successResponse(null, "Pengguna berhasil dihapus")
}
