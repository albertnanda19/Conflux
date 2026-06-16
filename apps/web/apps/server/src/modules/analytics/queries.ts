import { db } from "@/lib/db"

export async function findManyAnalitik(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdAnalitik(id: number) {
  return null as any
}

export async function createAnalitik(data: any) {
  return {} as any
}

export async function updateAnalitik(id: number, data: any) {
  return {} as any
}

export async function deleteAnalitik(id: number) {
  return {} as any
}
