import { db } from "@/lib/db"
import { channels } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

export async function listActiveTelegramChannels() {
  return db
    .select({ id: channels.id, credentials: channels.credentials })
    .from(channels)
    .where(and(eq(channels.provider, "telegram_bot"), eq(channels.isActive, true)))
}

const publicColumns = {
  id: channels.id,
  name: channels.name,
  type: channels.type,
  provider: channels.provider,
  isActive: channels.isActive,
  createdAt: channels.createdAt,
  updatedAt: channels.updatedAt,
}

export async function listChannels() {
  return db.select(publicColumns).from(channels).orderBy(channels.name)
}

export async function findChannelById(id: string) {
  const [row] = await db.select().from(channels).where(eq(channels.id, id)).limit(1)
  return row || null
}

export async function createChannel(data: {
  name: string
  type: string
  provider: string
  credentials?: unknown
  isActive?: boolean
}) {
  const [row] = await db.insert(channels).values(data).returning(publicColumns)
  return row
}

export async function updateChannel(
  id: string,
  data: { name?: string; credentials?: unknown; isActive?: boolean },
) {
  const [row] = await db
    .update(channels)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(channels.id, id))
    .returning(publicColumns)
  return row || null
}

export async function deleteChannel(id: string) {
  const [deleted] = await db.delete(channels).where(eq(channels.id, id)).returning({ id: channels.id })
  return deleted || null
}
