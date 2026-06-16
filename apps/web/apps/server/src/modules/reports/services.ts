import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listLaporan(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyLaporan(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getLaporan(id: number) {
  const item = await queries.findByIdLaporan(id)
  if (!item) throw new NotFoundError("Laporan tidak ditemukan")
  return item
}

export async function createLaporanService(data: any) {
  return queries.createLaporan(data)
}

export async function updateLaporanService(id: number, data: any) {
  await getLaporan(id)
  return queries.updateLaporan(id, data)
}

export async function deleteLaporanService(id: number) {
  await getLaporan(id)
  return queries.deleteLaporan(id)
}
