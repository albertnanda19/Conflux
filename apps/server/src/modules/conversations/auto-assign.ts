import { sql } from "drizzle-orm"
import { assignAgent } from "./queries"
import { findLeastBusyOnlineAgent } from "@/modules/users/queries"
import { createContactActivity } from "@/modules/contacts/queries"
import { notifyUsers } from "@/modules/notifications/services"
import { db } from "@/lib/db"
import { publishRealtime } from "@/lib/pubsub"
import { conversationRoom, agentRoom, INBOX_ROOM } from "@/lib/ws"

// Kunci tetap untuk advisory lock auto-assign (sembarang int64 unik konsisten).
const AUTO_ASSIGN_LOCK_KEY = 482917365

export async function autoAssign(
  conversationId: string,
  contactId: string,
  contactName?: string,
): Promise<string | null> {
  if (process.env.AUTO_ASSIGN_ENABLED === "false") return null

  // Bagian kritis (pilih agent least-busy + assign) diserialkan lintas proses/instance
  // via advisory lock transaksi → dua inbound bersamaan tak memilih agent yang sama.
  const agentId = await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(${AUTO_ASSIGN_LOCK_KEY})`)
    const agent = await findLeastBusyOnlineAgent(tx)
    if (!agent) return null
    await assignAgent(conversationId, agent.id, tx)
    return agent.id
  })
  if (!agentId) return null

  await createContactActivity({
    contactId,
    type: "assignment",
    description: "Percakapan di-assign otomatis ke agen yang tersedia.",
    agentId,
  })
  await publishRealtime({
    rooms: [conversationRoom(conversationId), agentRoom(agentId), INBOX_ROOM],
    type: "conversation:assigned",
    data: { id: conversationId, agentId },
  })
  await notifyUsers([agentId], {
    type: "new_assignment",
    title: "Percakapan baru ditugaskan",
    body: contactName ? `Percakapan dengan ${contactName} otomatis ditugaskan ke Anda.` : "Percakapan baru otomatis ditugaskan ke Anda.",
    conversationId,
  })

  return agentId
}
