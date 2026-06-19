import { describe, it, expect, beforeEach } from "vitest"
import { resetDb, apiRequest, token, seedUser } from "@/test/helpers"

let agentToken: string
let userId: string

beforeEach(async () => {
  await resetDb()
  const u = await seedUser({ status: "offline" })
  userId = u.id
  agentToken = await token({ sub: u.id, email: u.email, role: u.role })
})

describe("PATCH /users/me/status (integration)", () => {
  it("401 tanpa token", async () => {
    const r = await apiRequest("PATCH", "/users/me/status", { body: { status: "online" } })
    expect(r.status).toBe(401)
  })

  it("update status sendiri → 200 + tersimpan", async () => {
    const r = await apiRequest("PATCH", "/users/me/status", { token: agentToken, body: { status: "busy" } })
    expect(r.status).toBe(200)
    expect((r.body!.data as { status: string }).status).toBe("busy")
    expect((r.body!.data as { id: string }).id).toBe(userId)
  })

  it("status invalid → 422", async () => {
    const r = await apiRequest("PATCH", "/users/me/status", { token: agentToken, body: { status: "away" } })
    expect(r.status).toBe(422)
  })
})
