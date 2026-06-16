import { describe, it, expect } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "text-blue-500")
    expect(result).toBe("text-blue-500")
  })

  it("should handle conditional classes", () => {
    const result = cn("base", false && "hidden", "extra")
    expect(result).toContain("base")
    expect(result).not.toContain("hidden")
    expect(result).toContain("extra")
  })

  it("should handle undefined/null", () => {
    const result = cn("base", undefined, null)
    expect(result).toBe("base")
  })
})
