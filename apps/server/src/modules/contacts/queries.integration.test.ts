import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, seedContact } from "@/test/helpers"
import * as q from "./queries"

beforeEach(resetDb)

describe("contacts queries (integration)", () => {
  it("createContact + findContactById", async () => {
    const c = await q.createContact({ fullName: "Rina", phoneNumber: "+62811", source: "whatsapp" })
    const found = await q.findContactById(c.id)
    expect(found?.fullName).toBe("Rina")
    expect(found?.pipelineStatus).toBe("new_lead")
  })

  it("findContactByChannelIdentifier resolves dedup, null when absent", async () => {
    const c = await seedContact()
    await q.createContactChannel({ contactId: c.id, channelType: "whatsapp", channelIdentifier: "+62999", isPrimary: true })
    expect(await q.findContactByChannelIdentifier("whatsapp", "+62999")).toBe(c.id)
    expect(await q.findContactByChannelIdentifier("whatsapp", "nope")).toBeNull()
  })

  it("createContactChannel onConflictDoNothing returns null on duplicate identifier", async () => {
    const c = await seedContact()
    const first = await q.createContactChannel({ contactId: c.id, channelType: "whatsapp", channelIdentifier: "+62dup" })
    const dup = await q.createContactChannel({ contactId: c.id, channelType: "whatsapp", channelIdentifier: "+62dup" })
    expect(first).not.toBeNull()
    expect(dup).toBeNull()
  })

  it("contact activities create + list ordered newest first", async () => {
    const c = await seedContact()
    await q.createContactActivity({ contactId: c.id, type: "message_sent", description: "pertama" })
    await q.createContactActivity({ contactId: c.id, type: "assignment", description: "kedua", agentName: "Sari" })
    const acts = await q.listContactActivities(c.id)
    expect(acts).toHaveLength(2)
    expect(acts[0]!.agentName).toBe("Sari")
  })

  it("listContacts filters by search + paginates", async () => {
    await q.createContact({ fullName: "Alpha Lead", source: "whatsapp", pipelineStatus: "qualified" })
    await q.createContact({ fullName: "Beta Lead", source: "instagram", pipelineStatus: "new_lead" })
    const r = await q.listContacts({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc", search: "Alpha" } as never)
    expect(r.meta.total).toBe(1)
    expect(r.data[0]!.fullName).toBe("Alpha Lead")
  })
})
