import { describe, it, expect, vi, beforeEach } from "vitest"
import { computeInitials, getAgents } from "./services"
import * as queries from "./queries"

vi.mock("./queries", () => ({ listAgents: vi.fn() }))

describe("computeInitials", () => {
  it("takes first two words", () => {
    expect(computeInitials("Sari Dewi")).toBe("SD")
  })
  it("handles single word", () => {
    expect(computeInitials("Admin")).toBe("A")
  })
  it("ignores extra spaces", () => {
    expect(computeInitials("  Nina   Kusuma  ")).toBe("NK")
  })
})

describe("getAgents", () => {
  beforeEach(() => vi.clearAllMocks())

  it("maps agent rows to FE shape with initials", async () => {
    vi.mocked(queries.listAgents).mockResolvedValue([
      { id: "u1", fullName: "Sari Dewi", status: "online", avatarUrl: null, activeConversationCount: 2 },
    ] as never)
    const result = await getAgents()
    expect(result).toEqual([
      { id: "u1", name: "Sari Dewi", initials: "SD", status: "online", avatarUrl: null, activeConversationCount: 2 },
    ])
  })
})
