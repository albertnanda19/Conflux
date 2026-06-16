import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { broadcastQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = broadcastQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listSiaran(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getSiaran(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createSiaranService(body)
  return successResponse(item, "Siaran berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updateSiaranService(id, body)
  return successResponse(item, "Siaran berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deleteSiaranService(id)
  return successResponse(null, "Siaran berhasil dihapus")
}
