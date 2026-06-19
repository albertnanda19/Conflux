import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/dbb_psc"

const client = postgres(connectionString, {
  max: 20,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })

export type DbExecutor = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0]

export { schema }
