import { db } from "@/lib/db"

export async function findManySiaran(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdSiaran(id: number) {
  return null as any
}

export async function createSiaran(data: any) {
  return {} as any
}

export async function updateSiaran(id: number, data: any) {
  return {} as any
}

export async function deleteSiaran(id: number) {
  return {} as any
}
