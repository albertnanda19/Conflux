import { defineConfig } from "drizzle-kit"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

function loadEnvUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  try {
    const content = readFileSync(resolve(process.cwd(), "../../.env"), "utf8")
    const match = content.match(/^DATABASE_URL=(.*)$/m)
    return match?.[1]?.trim().replace(/^["']|["']$/g, "")
  } catch {
    return undefined
  }
}

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: loadEnvUrl() || "postgresql://postgres:postgres@localhost:5432/dbb_psc",
  },
})
