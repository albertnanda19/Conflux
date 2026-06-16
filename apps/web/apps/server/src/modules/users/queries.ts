import { db } from "@/lib/db"

export async function findManyPengguna(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPengguna(id: number) {
  return null as any
}

export async function createPengguna(data: any) {
  return {} as any
}

export async function updatePengguna(id: number, data: any) {
  return {} as any
}

export async function deletePengguna(id: number) {
  return {} as any
}
