import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, apiRequest, token, seedUser } from "@/test/helpers"
import { notifyUsers } from "./services"

let agentToken: string
let userId: string

beforeEach(async () => {
  await resetDb()
  const u = await seedUser()
  userId = u.id
  agentToken = await token({ sub: u.id, email: u.email, role: u.role })
})

describe("notifications (integration)", () => {
  it("401 tanpa token", async () => {
    const r = await apiRequest("GET", "/notifications")
    expect(r.status).toBe(401)
  })

  it("GET hanya notif milik user + unreadCount", async () => {
    const other = await seedUser()
    await notifyUsers([userId], { type: "new_message", title: "A" })
    await notifyUsers([userId], { type: "new_message", title: "B" })
    await notifyUsers([other.id], { type: "new_message", title: "C" })
    const r = await apiRequest("GET", "/notifications", { token: agentToken })
    expect(r.status).toBe(200)
    const data = r.body!.data as { data: unknown[]; unreadCount: number }
    expect(data.data).toHaveLength(2)
    expect(data.unreadCount).toBe(2)
  })

  it("mark read → unreadCount turun", async () => {
    await notifyUsers([userId], { type: "new_message", title: "A" })
    const list = await apiRequest("GET", "/notifications", { token: agentToken })
    const id = (list.body!.data as { data: { id: string }[] }).data[0]!.id
    const mark = await apiRequest("POST", `/notifications/${id}/read`, { token: agentToken })
    expect(mark.status).toBe(200)
    const after = await apiRequest("GET", "/notifications?unreadOnly=true", { token: agentToken })
    expect((after.body!.data as { unreadCount: number }).unreadCount).toBe(0)
  })

  it("read-all menandai semua", async () => {
    await notifyUsers([userId], { type: "new_message", title: "A" })
    await notifyUsers([userId], { type: "new_assignment", title: "B" })
    await apiRequest("POST", "/notifications/read-all", { token: agentToken })
    const after = await apiRequest("GET", "/notifications", { token: agentToken })
    expect((after.body!.data as { unreadCount: number }).unreadCount).toBe(0)
  })
})
