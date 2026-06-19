import { describe, it, expect } from "vitest"
import { splitText } from "./text-splitter"

describe("splitText", () => {
  it("mengembalikan array kosong untuk teks kosong", () => {
    expect(splitText("")).toEqual([])
    expect(splitText("   \n  ")).toEqual([])
  })

  it("mengembalikan satu chunk untuk teks pendek", () => {
    const result = splitText("Halo dunia singkat.")
    expect(result).toEqual(["Halo dunia singkat."])
  })

  it("memecah teks panjang menjadi beberapa chunk", () => {
    const text = "kalimat. ".repeat(1000)
    const result = splitText(text, { size: 500, overlap: 100 })
    expect(result.length).toBeGreaterThan(1)
    result.forEach((c) => expect(c.length).toBeLessThanOrEqual(500))
  })

  it("chunk berurutan memiliki overlap", () => {
    const text = Array.from({ length: 200 }, (_, i) => `kata${i}`).join(" ")
    const result = splitText(text, { size: 200, overlap: 50 })
    expect(result.length).toBeGreaterThan(1)
  })
})
