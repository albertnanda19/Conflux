import { db } from "@/lib/db"

export async function findManyKontak(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdKontak(id: number) {
  return null as any
}

export async function createKontak(data: any) {
  return {} as any
}

export async function updateKontak(id: number, data: any) {
  return {} as any
}

export async function deleteKontak(id: number) {
  return {} as any
}
