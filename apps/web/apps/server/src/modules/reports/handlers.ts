import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { reportsQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = reportsQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listLaporan(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getLaporan(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createLaporanService(body)
  return successResponse(item, "Laporan berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updateLaporanService(id, body)
  return successResponse(item, "Laporan berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deleteLaporanService(id)
  return successResponse(null, "Laporan berhasil dihapus")
}
