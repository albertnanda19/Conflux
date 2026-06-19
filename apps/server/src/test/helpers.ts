import { Elysia } from "elysia"
import { apiRoutes } from "@/routes"
import { errorHandler } from "@/middleware/error-handler"
import { db } from "@/lib/db"
import { sql, eq } from "drizzle-orm"
import { signAccessToken } from "@/lib/auth"
import {
  users,
  channels,
  contacts,
  contactChannels,
  conversations,
  labels,
  messages,
  aiAssistants,
  aiProviders,
  aiSettings,
  kbDocuments,
} from "@/lib/schema"

export const testApp = new Elysia().onError(errorHandler).use(apiRoutes)

const TABLES = [
  "conversation_labels",
  "contact_activities",
  "messages",
  "conversations",
  "contact_channels",
  "contacts",
  "labels",
  "quick_replies",
  "kb_documents",
  "ai_assistants",
  "ai_providers",
  "ai_settings",
  "channels",
  "users",
]

export async function resetDb() {
  await db.execute(sql.raw(`TRUNCATE ${TABLES.map((t) => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE`))
}

export async function token(payload: { sub: string; email: string; role: string }) {
  return signAccessToken(payload)
}

export async function apiRequest(
  method: string,
  path: string,
  opts: { token?: string; body?: unknown } = {},
) {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`
  const res = await testApp.handle(
    new Request(`http://localhost/api/v1${path}`, {
      method,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    }),
  )
  const json = res.status === 204 ? null : await res.json().catch(() => null)
  return { status: res.status, body: json as { success: boolean; data?: unknown; message: string; errors?: Record<string, string[]> } | null }
}

export async function seedUser(over: Partial<typeof users.$inferInsert> = {}) {
  const [row] = await db
    .insert(users)
    .values({ email: `u${Date.now()}${Math.random()}@test.com`, passwordHash: "x", fullName: "Test Agent", role: "agent", ...over })
    .returning()
  return row!
}

export async function seedChannel(over: Partial<typeof channels.$inferInsert> = {}) {
  const [row] = await db
    .insert(channels)
    .values({ name: "Test WA", type: "whatsapp", provider: "whatsapp_cloud", ...over })
    .returning()
  return row!
}

export async function seedContact(over: Partial<typeof contacts.$inferInsert> = {}) {
  const [row] = await db.insert(contacts).values({ fullName: "Test Lead", source: "whatsapp", ...over }).returning()
  return row!
}

export async function seedContactChannel(contactId: string, channelType: string, identifier: string) {
  const [row] = await db
    .insert(contactChannels)
    .values({ contactId, channelType, channelIdentifier: identifier, isPrimary: true })
    .returning()
  return row!
}

export async function seedConversation(contactId: string, channelId: string, over: Partial<typeof conversations.$inferInsert> = {}) {
  const [row] = await db.insert(conversations).values({ contactId, channelId, status: "open", ...over }).returning()
  return row!
}

export async function seedLabel(over: Partial<typeof labels.$inferInsert> = {}) {
  const [row] = await db.insert(labels).values({ name: "Test Label", color: "#000", ...over }).returning()
  return row!
}

export async function seedOutboundMessage(conversationId: string, externalMessageId: string, status = "sent") {
  const [row] = await db
    .insert(messages)
    .values({ conversationId, direction: "outbound", senderType: "agent", contentType: "text", content: { text: "x" }, status, externalMessageId })
    .returning()
  return row!
}

export async function getMessageById(id: string) {
  const [row] = await db.select().from(messages).where(eq(messages.id, id)).limit(1)
  return row || null
}

export async function seedAssistant(over: Partial<typeof aiAssistants.$inferInsert> = {}) {
  const [row] = await db.insert(aiAssistants).values({ name: "Test Assistant", ...over }).returning()
  return row!
}

export async function seedProvider(over: Partial<typeof aiProviders.$inferInsert> = {}) {
  const [row] = await db
    .insert(aiProviders)
    .values({ name: "Test Provider", model: "test-model", priority: 1, envKeyName: "GEMINI_API_KEY", ...over })
    .returning()
  return row!
}

export async function seedAiSettings(over: Partial<typeof aiSettings.$inferInsert> = {}) {
  const [row] = await db.insert(aiSettings).values({ ...over }).returning()
  return row!
}

export async function seedKbDocument(over: Partial<typeof kbDocuments.$inferInsert> = {}) {
  const [row] = await db.insert(kbDocuments).values({ title: "Test Doc", ...over }).returning()
  return row!
}
