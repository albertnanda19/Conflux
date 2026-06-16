import { db } from "./db"
import { users } from "./schema"
import { hashPassword } from "./auth"

async function seed() {
  console.log("[Seed] Memulai pengisian data awal...")

  const password = await hashPassword("password123")
  const adminEmail = "admin@test.com"

  const existing = await db.select().from(users).limit(1)

  if (existing.length > 0) {
    console.log("[Seed] Data sudah ada. Melewati proses seed.")
    process.exit(0)
  }

  await db.insert(users).values([
    {
      email: adminEmail,
      passwordHash: password,
      fullName: "Admin User",
      role: "super_admin",
      status: "offline",
    },
    {
      email: "agent@test.com",
      passwordHash: password,
      fullName: "Agent User",
      role: "agent",
      status: "offline",
    },
  ])

  console.log("[Seed] Data awal berhasil dibuat.")
  console.log("[Seed] Email: admin@test.com | Kata Sandi: password123")
  console.log("[Seed] Email: agent@test.com | Kata Sandi: password123")
  process.exit(0)
}

seed().catch((err) => {
  console.error("[Seed] Gagal mengisi data awal:", err)
  process.exit(1)
})
