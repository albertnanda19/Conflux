import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { resetDb, apiRequest, token, seedUser, seedProvider } from "@/test/helpers"

beforeEach(resetDb)
const ENV = { ...process.env }
afterEach(() => { process.env = { ...ENV } })

async function adminToken() {
  const u = await seedUser({ role: "super_admin", email: `a${Math.random()}@test.com` })
  return token({ sub: u.id, email: u.email, role: "super_admin" })
}

describe("Settings AI handlers (integration)", () => {
  it("GET /settings/ai membuat settings default + status provider terderivasi", async () => {
    const t = await adminToken()
    process.env.GEMINI_API_KEY = "key"
    await seedProvider({ name: "Gemini", priority: 1, envKeyName: "GEMINI_API_KEY", isEnabled: true })
    delete process.env.OPENAI_API_KEY
    await seedProvider({ name: "OpenAI", priority: 3, envKeyName: "OPENAI_API_KEY", isEnabled: true })

    const res = await apiRequest("GET", "/settings/ai", { token: t })
    expect(res.status).toBe(200)
    const data = res.body!.data as { aiEnabled: boolean; providers: { name: string; status: string; hasKey: boolean }[] }
    expect(data.aiEnabled).toBe(true)
    const gemini = data.providers.find((p) => p.name === "Gemini")!
    const openai = data.providers.find((p) => p.name === "OpenAI")!
    expect(gemini.status).toBe("active")
    expect(openai.status).toBe("error")
    expect(openai.hasKey).toBe(false)
  })

  it("PATCH /settings/ai toggle aiEnabled", async () => {
    const t = await adminToken()
    const res = await apiRequest("PATCH", "/settings/ai", { token: t, body: { aiEnabled: false } })
    expect((res.body!.data as { aiEnabled: boolean }).aiEnabled).toBe(false)
  })

  it("PATCH provider memperbarui config non-rahasia", async () => {
    const t = await adminToken()
    const p = await seedProvider({ name: "Gemini", priority: 1, envKeyName: "GEMINI_API_KEY" })
    const res = await apiRequest("PATCH", `/settings/ai/providers/${p.id}`, { token: t, body: { temperature: 0.2, priority: 2, isEnabled: false } })
    const data = res.body!.data as { temperature: number; priority: number; isEnabled: boolean }
    expect(data.temperature).toBe(0.2)
    expect(data.priority).toBe(2)
    expect(data.isEnabled).toBe(false)
  })

  it("agent biasa tidak boleh patch (403)", async () => {
    const u = await seedUser({ role: "agent" })
    const t = await token({ sub: u.id, email: u.email, role: "agent" })
    const res = await apiRequest("PATCH", "/settings/ai", { token: t, body: { aiEnabled: true } })
    expect(res.status).toBe(403)
  })
})
