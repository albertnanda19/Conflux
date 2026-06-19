import { loadRootEnv, testDatabaseUrl } from "./env"

loadRootEnv()
process.env.DATABASE_URL = testDatabaseUrl()
process.env.CHANNEL_SIMULATE = "true"
if (!process.env.ENCRYPTION_KEY) {
  process.env.ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64")
}
