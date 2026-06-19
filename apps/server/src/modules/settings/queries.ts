import { db } from "@/lib/db"
import { aiSettings, aiProviders } from "@/lib/schema"
import { asc, eq } from "drizzle-orm"
import type { UpdateProviderInput } from "./types"

export async function getOrCreateSettings() {
  const [existing] = await db.select().from(aiSettings).limit(1)
  if (existing) return existing
  const [created] = await db.insert(aiSettings).values({}).returning()
  return created!
}

export async function updateAiEnabled(aiEnabled: boolean) {
  const settings = await getOrCreateSettings()
  const [row] = await db
    .update(aiSettings)
    .set({ aiEnabled, updatedAt: new Date() })
    .where(eq(aiSettings.id, settings.id))
    .returning()
  return row!
}

export async function listProviders() {
  return db.select().from(aiProviders).orderBy(asc(aiProviders.priority))
}

export async function findProviderById(id: string) {
  const [row] = await db.select().from(aiProviders).where(eq(aiProviders.id, id)).limit(1)
  return row || null
}

export async function updateProvider(id: string, input: UpdateProviderInput) {
  const [row] = await db
    .update(aiProviders)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(aiProviders.id, id))
    .returning()
  return row!
}
