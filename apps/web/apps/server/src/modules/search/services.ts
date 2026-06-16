import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPencarian(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPencarian(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPencarian(id: number) {
  const item = await queries.findByIdPencarian(id)
  if (!item) throw new NotFoundError("Pencarian tidak ditemukan")
  return item
}

export async function createPencarianService(data: any) {
  return queries.createPencarian(data)
}

export async function updatePencarianService(id: number, data: any) {
  await getPencarian(id)
  return queries.updatePencarian(id, data)
}

export async function deletePencarianService(id: number) {
  await getPencarian(id)
  return queries.deletePencarian(id)
}
