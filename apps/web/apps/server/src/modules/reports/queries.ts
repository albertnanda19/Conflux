import { db } from "@/lib/db"

export async function findManyLaporan(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdLaporan(id: number) {
  return null as any
}

export async function createLaporan(data: any) {
  return {} as any
}

export async function updateLaporan(id: number, data: any) {
  return {} as any
}

export async function deleteLaporan(id: number) {
  return {} as any
}
