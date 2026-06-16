import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listKontak(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyKontak(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getKontak(id: number) {
  const item = await queries.findByIdKontak(id)
  if (!item) throw new NotFoundError("Kontak tidak ditemukan")
  return item
}

export async function createKontakService(data: any) {
  return queries.createKontak(data)
}

export async function updateKontakService(id: number, data: any) {
  await getKontak(id)
  return queries.updateKontak(id, data)
}

export async function deleteKontakService(id: number) {
  await getKontak(id)
  return queries.deleteKontak(id)
}
