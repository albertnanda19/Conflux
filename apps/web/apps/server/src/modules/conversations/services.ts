import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPercakapan(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPercakapan(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPercakapan(id: number) {
  const item = await queries.findByIdPercakapan(id)
  if (!item) throw new NotFoundError("Percakapan tidak ditemukan")
  return item
}

export async function createPercakapanService(data: any) {
  return queries.createPercakapan(data)
}

export async function updatePercakapanService(id: number, data: any) {
  await getPercakapan(id)
  return queries.updatePercakapan(id, data)
}

export async function deletePercakapanService(id: number) {
  await getPercakapan(id)
  return queries.deletePercakapan(id)
}
