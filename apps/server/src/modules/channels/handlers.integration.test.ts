import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, apiRequest, token, seedUser, seedChannel } from "@/test/helpers"

let agentToken: string
let adminToken: string

beforeEach(async () => {
  await resetDb()
  const agent = await seedUser({ role: "agent" })
  const admin = await seedUser({ role: "admin" })
  agentToken = await token({ sub: agent.id, email: agent.email, role: agent.role })
  adminToken = await token({ sub: admin.id, email: admin.email, role: admin.role })
})

describe("channels handlers (integration)", () => {
  it("agent forbidden to create channel (403)", async () => {
    const r = await apiRequest("POST", "/channels", { token: agentToken, body: { name: "X", type: "whatsapp", provider: "whatsapp_cloud" } })
    expect(r.status).toBe(403)
  })

  it("admin creates channel (200)", async () => {
    const r = await apiRequest("POST", "/channels", { token: adminToken, body: { name: "WA Official", type: "whatsapp", provider: "whatsapp_cloud" } })
    expect(r.status).toBe(200)
    expect((r.body!.data as { provider: string }).provider).toBe("whatsapp_cloud")
  })

  it("any authed user lists channels (200)", async () => {
    await seedChannel({ name: "Seeded", provider: "whatsapp_fonnte" })
    const r = await apiRequest("GET", "/channels", { token: agentToken })
    expect(r.status).toBe(200)
    expect((r.body!.data as unknown[]).length).toBe(1)
  })

  it("422 on invalid provider", async () => {
    const r = await apiRequest("POST", "/channels", { token: adminToken, body: { name: "X", type: "whatsapp", provider: "bogus" } })
    expect(r.status).toBe(422)
  })

  it("simulate-inbound enqueues (200, queued=1)", async () => {
    const ch = await seedChannel()
    const r = await apiRequest("POST", `/channels/${ch.id}/simulate-inbound`, {
      token: agentToken,
      body: { channelIdentifier: "+62812345", contentType: "text", content: { text: "halo" } },
    })
    expect(r.status).toBe(200)
    expect((r.body!.data as { queued: number }).queued).toBe(1)
  })
})
