import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPipeline(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPipeline(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPipeline(id: number) {
  const item = await queries.findByIdPipeline(id)
  if (!item) throw new NotFoundError("Pipeline tidak ditemukan")
  return item
}

export async function createPipelineService(data: any) {
  return queries.createPipeline(data)
}

export async function updatePipelineService(id: number, data: any) {
  await getPipeline(id)
  return queries.updatePipeline(id, data)
}

export async function deletePipelineService(id: number) {
  await getPipeline(id)
  return queries.deletePipeline(id)
}
