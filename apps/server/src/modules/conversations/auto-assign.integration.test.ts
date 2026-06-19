import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { resetDb, seedUser, seedChannel, seedContact, seedConversation } from "@/test/helpers"
import { findLeastBusyOnlineAgent } from "@/modules/users/queries"
import { ingestInbound } from "@/modules/messages/ingest"
import { db } from "@/lib/db"
import { conversations, notifications } from "@/lib/schema"
import { eq, inArray } from "drizzle-orm"

beforeEach(resetDb)
const prev = process.env.AUTO_ASSIGN_ENABLED
afterEach(() => { process.env.AUTO_ASSIGN_ENABLED = prev })

describe("findLeastBusyOnlineAgent (integration)", () => {
  it("pilih agent online dgn beban terkecil; abaikan offline/busy", async () => {
    const ch = await seedChannel()
    const ct = await seedContact()
    const busyOnline = await seedUser({ role: "agent", status: "online", fullName: "A Busy" })
    const freeOnline = await seedUser({ role: "agent", status: "online", fullName: "B Free" })
    await seedUser({ role: "agent", status: "offline", fullName: "C Offline" })
    // busyOnline punya 1 percakapan open
    await seedConversation(ct.id, ch.id, { agentId: busyOnline.id, status: "open" })

    const picked = await findLeastBusyOnlineAgent()
    expect(picked?.id).toBe(freeOnline.id)
  })

  it("null bila tak ada agent online", async () => {
    await seedUser({ role: "agent", status: "offline" })
    expect(await findLeastBusyOnlineAgent()).toBeNull()
  })
})

describe("ingest auto-assign (integration)", () => {
  it("inbound baru + ada agent online → conversation ter-assign + notif new_assignment", async () => {
    delete process.env.AUTO_ASSIGN_ENABLED
    const ch = await seedChannel({ type: "whatsapp", provider: "whatsapp_fonnte" })
    const agent = await seedUser({ role: "agent", status: "online", fullName: "Agent Online" })

    const res = await ingestInbound(ch.id, {
      channelType: "whatsapp",
      channelIdentifier: "628auto1",
      contactName: "Lead Auto",
      contentType: "text",
      content: { text: "halo" },
      externalMessageId: "auto1",
    })

    const [conv] = await db.select().from(conversations).where(eq(conversations.id, res.conversationId))
    expect(conv!.agentId).toBe(agent.id)
    const notif = await db.select().from(notifications).where(eq(notifications.userId, agent.id))
    expect(notif.some((n) => n.type === "new_assignment")).toBe(true)
  })

  it("RACE: 2 inbound paralel → agent berbeda (advisory lock)", async () => {
    delete process.env.AUTO_ASSIGN_ENABLED
    const ch = await seedChannel({ type: "whatsapp", provider: "whatsapp_fonnte" })
    await seedUser({ role: "agent", status: "online", fullName: "Agent A" })
    await seedUser({ role: "agent", status: "online", fullName: "Agent B" })

    const mk = (n: string) => ingestInbound(ch.id, {
      channelType: "whatsapp", channelIdentifier: "628race" + n, contactName: "Race " + n,
      contentType: "text", content: { text: "halo" }, externalMessageId: "race" + n,
    })
    const [r1, r2] = await Promise.all([mk("1"), mk("2")])

    const rows = await db.select().from(conversations).where(inArray(conversations.id, [r1.conversationId, r2.conversationId]))
    const agents = rows.map((r) => r.agentId)
    expect(agents.every(Boolean)).toBe(true)
    expect(new Set(agents).size).toBe(2)
  })

  it("tak ada agent online → conversation tetap unassigned", async () => {
    delete process.env.AUTO_ASSIGN_ENABLED
    await seedUser({ role: "agent", status: "offline" })
    const ch = await seedChannel({ type: "whatsapp", provider: "whatsapp_fonnte" })
    const res = await ingestInbound(ch.id, {
      channelType: "whatsapp",
      channelIdentifier: "628auto2",
      contactName: "Lead Q",
      contentType: "text",
      content: { text: "halo" },
      externalMessageId: "auto2",
    })
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, res.conversationId))
    expect(conv!.agentId).toBeNull()
  })
})
