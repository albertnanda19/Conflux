import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { conversationsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = conversationsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPercakapan(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPercakapan(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPercakapanService(body)
  return successResponse(item, "Percakapan berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePercakapanService(id, body)
  return successResponse(item, "Percakapan berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePercakapanService(id)
  return successResponse(null, "Percakapan berhasil dihapus")
}
