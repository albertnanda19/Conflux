import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listAnalitik(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyAnalitik(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getAnalitik(id: number) {
  const item = await queries.findByIdAnalitik(id)
  if (!item) throw new NotFoundError("Analitik tidak ditemukan")
  return item
}

export async function createAnalitikService(data: any) {
  return queries.createAnalitik(data)
}

export async function updateAnalitikService(id: number, data: any) {
  await getAnalitik(id)
  return queries.updateAnalitik(id, data)
}

export async function deleteAnalitikService(id: number) {
  await getAnalitik(id)
  return queries.deleteAnalitik(id)
}
