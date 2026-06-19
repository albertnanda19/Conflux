import { readFileSync } from "node:fs"
import { resolve } from "node:path"

export function loadRootEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), "../../.env"), "utf8")
    for (const line of content.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
      if (m && process.env[m[1]!] === undefined) {
        process.env[m[1]!] = m[2]!.trim().replace(/^["']|["']$/g, "")
      }
    }
  } catch {
    // .env optional — fall back to defaults
  }
}

export function testDatabaseUrl(): string {
  const base = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/dbb_psc"
  const url = new URL(base)
  url.pathname = "/dbb_psc_test"
  return url.toString()
}
