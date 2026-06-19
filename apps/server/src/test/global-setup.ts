import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { loadRootEnv, testDatabaseUrl } from "./env"

export default async function globalSetup() {
  loadRootEnv()
  const url = new URL(testDatabaseUrl())
  const dbName = url.pathname.slice(1)

  const adminUrl = new URL(url.toString())
  adminUrl.pathname = "/postgres"
  const admin = postgres(adminUrl.toString(), { max: 1 })
  try {
    const exists = await admin`SELECT 1 FROM pg_database WHERE datname = ${dbName}`
    if (exists.length === 0) {
      await admin.unsafe(`CREATE DATABASE "${dbName}"`)
      console.log(`[IntegrationSetup] Database test "${dbName}" dibuat.`)
    }
  } finally {
    await admin.end()
  }

  const client = postgres(url.toString(), { max: 1 })
  try {
    await migrate(drizzle(client), { migrationsFolder: "./drizzle" })
    console.log("[IntegrationSetup] Migrasi diterapkan ke database test.")
  } finally {
    await client.end()
  }
}
