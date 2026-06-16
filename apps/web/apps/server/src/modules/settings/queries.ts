import { db } from "@/lib/db"

export async function findManyPengaturan(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPengaturan(id: number) {
  return null as any
}

export async function createPengaturan(data: any) {
  return {} as any
}

export async function updatePengaturan(id: number, data: any) {
  return {} as any
}

export async function deletePengaturan(id: number) {
  return {} as any
}
