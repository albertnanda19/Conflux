import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, apiRequest, token, seedUser, seedChannel, seedContact, seedConversation } from "@/test/helpers"

let agentToken: string

beforeEach(async () => {
  await resetDb()
  const u = await seedUser()
  agentToken = await token({ sub: u.id, email: u.email, role: u.role })
})

async function seedConv() {
  const ch = await seedChannel({ provider: 'simulator' })
  const ct = await seedContact()
  return seedConversation(ct.id, ch.id)
}

describe("messages handlers (integration)", () => {
  it("sends a message then lists it", async () => {
    const cv = await seedConv()
    const send = await apiRequest("POST", `/conversations/${cv.id}/messages`, {
      token: agentToken,
      body: { contentType: "text", content: { text: "Halo balasan agent" } },
    })
    expect(send.status).toBe(200)
    const sent = send.body!.data as { senderType: string; content: string; status: string }
    expect(sent.senderType).toBe("agent")
    expect(sent.status).toBe("sent")

    const list = await apiRequest("GET", `/conversations/${cv.id}/messages`, { token: agentToken })
    const data = (list.body!.data as { data: Array<{ content: string }>; nextCursor: string | null }).data
    expect(data).toHaveLength(1)
    expect(data[0]!.content).toBe("Halo balasan agent")
  })

  it("422 on invalid send (text without content.text)", async () => {
    const cv = await seedConv()
    const r = await apiRequest("POST", `/conversations/${cv.id}/messages`, {
      token: agentToken,
      body: { contentType: "text", content: {} },
    })
    expect(r.status).toBe(422)
  })

  it("404 send to unknown conversation", async () => {
    const r = await apiRequest("POST", "/conversations/11111111-1111-1111-1111-111111111111/messages", {
      token: agentToken,
      body: { contentType: "text", content: { text: "x" } },
    })
    expect(r.status).toBe(404)
  })

  it("401 without token", async () => {
    const cv = await seedConv()
    const r = await apiRequest("GET", `/conversations/${cv.id}/messages`)
    expect(r.status).toBe(401)
  })
})
