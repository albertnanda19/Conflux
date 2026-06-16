import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listSiaran(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManySiaran(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getSiaran(id: number) {
  const item = await queries.findByIdSiaran(id)
  if (!item) throw new NotFoundError("Siaran tidak ditemukan")
  return item
}

export async function createSiaranService(data: any) {
  return queries.createSiaran(data)
}

export async function updateSiaranService(id: number, data: any) {
  await getSiaran(id)
  return queries.updateSiaran(id, data)
}

export async function deleteSiaranService(id: number) {
  await getSiaran(id)
  return queries.deleteSiaran(id)
}
