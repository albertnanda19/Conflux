import { successResponse, paginatedResponse } from "@/lib/errors"
import { ValidationError } from "@/lib/errors"
import * as service from "./services"
import { pipelineQuerySchema } from "./types"

export async function handleList(query: any) {
  const parsed = pipelineQuerySchema.safeParse(query)
  if (!parsed.success) throw new ValidationError("Parameter tidak valid", parsed.error.flatten().fieldErrors)
  const { page, limit } = parsed.data
  const result = await service.listPipeline(page, limit)
  return paginatedResponse(result.items, result.total, page, limit)
}

export async function handleGet(params: { id: string }) {
  const id = Number(params.id)
  const item = await service.getPipeline(id)
  return successResponse(item)
}

export async function handleCreate(body: any) {
  const item = await service.createPipelineService(body)
  return successResponse(item, "Pipeline berhasil dibuat")
}

export async function handleUpdate(params: { id: string }, body: any) {
  const id = Number(params.id)
  const item = await service.updatePipelineService(id, body)
  return successResponse(item, "Pipeline berhasil diperbarui")
}

export async function handleDelete(params: { id: string }) {
  const id = Number(params.id)
  await service.deletePipelineService(id)
  return successResponse(null, "Pipeline berhasil dihapus")
}
