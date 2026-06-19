import { describe, it, expect } from "vitest"
import { isWithinWorkingHours, oooMessageOf } from "./working-hours"

const WH = {
  timezone: "Asia/Jakarta (WIB, UTC+7)",
  days: [
    { day: "monday", dayLabel: "Senin", enabled: true, start: "08:00", end: "17:00" },
    { day: "sunday", dayLabel: "Minggu", enabled: false, start: "09:00", end: "14:00" },
  ],
  oooMessage: "Di luar jam kerja.",
}

// Senin 2026-06-15 10:00 WIB = 03:00 UTC
const monday10wib = new Date("2026-06-15T03:00:00Z")
// Senin 2026-06-15 20:00 WIB = 13:00 UTC
const monday20wib = new Date("2026-06-15T13:00:00Z")
// Minggu 2026-06-14 10:00 WIB = 03:00 UTC
const sunday10wib = new Date("2026-06-14T03:00:00Z")

describe("isWithinWorkingHours", () => {
  it("true di dalam jam kerja (Senin 10:00 WIB)", () => {
    expect(isWithinWorkingHours(WH, monday10wib)).toBe(true)
  })
  it("false di luar jam (Senin 20:00 WIB)", () => {
    expect(isWithinWorkingHours(WH, monday20wib)).toBe(false)
  })
  it("false pada hari nonaktif (Minggu)", () => {
    expect(isWithinWorkingHours(WH, sunday10wib)).toBe(false)
  })
  it("true bila tanpa config (default aktif)", () => {
    expect(isWithinWorkingHours(null)).toBe(true)
    expect(isWithinWorkingHours({ days: [] })).toBe(true)
  })
})

describe("oooMessageOf", () => {
  it("pakai pesan kustom", () => {
    expect(oooMessageOf(WH)).toBe("Di luar jam kerja.")
  })
  it("fallback bila kosong", () => {
    expect(oooMessageOf(null)).toContain("di luar jam kerja")
  })
})
