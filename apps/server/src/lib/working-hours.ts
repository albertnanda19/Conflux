type WorkingDay = { day: string; enabled: boolean; start: string; end: string }
type WorkingHours = { timezone?: string; days?: WorkingDay[]; oooMessage?: string }

function extractTimezone(raw?: string): string {
  if (!raw) return "Asia/Jakarta"
  const match = raw.match(/[A-Za-z]+\/[A-Za-z_]+/)
  return match ? match[0] : "Asia/Jakarta"
}

export function isWithinWorkingHours(workingHours: unknown, now = new Date()): boolean {
  const wh = workingHours as WorkingHours | null
  if (!wh?.days?.length) return true

  const tz = extractTimezone(wh.timezone)
  let parts: Intl.DateTimeFormatPart[]
  try {
    parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now)
  } catch {
    return true
  }

  const weekday = parts.find((p) => p.type === "weekday")?.value.toLowerCase() ?? ""
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00"
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00"
  const current = `${hour}:${minute}`

  const day = wh.days.find((d) => d.day.toLowerCase() === weekday)
  if (!day || !day.enabled) return false
  return current >= day.start && current <= day.end
}

export function oooMessageOf(workingHours: unknown): string {
  const wh = workingHours as WorkingHours | null
  return (
    wh?.oooMessage?.trim() ||
    "Terima kasih telah menghubungi kami. Saat ini kami di luar jam kerja dan akan membalas pesan Anda secepatnya."
  )
}
