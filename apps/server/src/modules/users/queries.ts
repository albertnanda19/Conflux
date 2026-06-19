import { db, type DbExecutor } from "@/lib/db"
import { users, conversations } from "@/lib/schema"
import { eq, and, sql, inArray, asc } from "drizzle-orm"

export async function findLeastBusyOnlineAgent(exec: DbExecutor = db) {
  const [row] = await exec
    .select({
      id: users.id,
      activeConversationCount:
        sql<number>`count(${conversations.id}) filter (where ${conversations.status} in ('open','pending'))`.mapWith(Number),
    })
    .from(users)
    .leftJoin(conversations, eq(conversations.agentId, users.id))
    .where(and(eq(users.role, "agent"), eq(users.status, "online")))
    .groupBy(users.id)
    .orderBy(asc(sql`count(${conversations.id}) filter (where ${conversations.status} in ('open','pending'))`), asc(users.fullName))
    .limit(1)
  return row || null
}

export async function getUserStatusById(userId: string) {
  const [row] = await db.select({ id: users.id, status: users.status }).from(users).where(eq(users.id, userId)).limit(1)
  return row || null
}

export async function listUserIdsByRoles(roles: string[]) {
  const rows = await db.select({ id: users.id }).from(users).where(inArray(users.role, roles))
  return rows.map((r) => r.id)
}

export async function updateUserStatus(userId: string, status: string) {
  const [row] = await db
    .update(users)
    .set({ status, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning({ id: users.id, status: users.status })
  return row || null
}

export async function listAgents() {
  return db
    .select({
      id: users.id,
      fullName: users.fullName,
      status: users.status,
      avatarUrl: users.avatarUrl,
      activeConversationCount:
        sql<number>`count(${conversations.id}) filter (where ${conversations.status} in ('open','pending'))`.mapWith(Number),
    })
    .from(users)
    .leftJoin(conversations, eq(conversations.agentId, users.id))
    .where(eq(users.role, "agent"))
    .groupBy(users.id)
    .orderBy(users.fullName)
}
