import { listAgents, updateUserStatus } from "./queries"
import { publishRealtime } from "@/lib/pubsub"
import { INBOX_ROOM } from "@/lib/ws"
import { NotFoundError } from "@/lib/errors"

export type AgentResponse = {
  id: string
  name: string
  initials: string
  status: string
  avatarUrl: string | null
  activeConversationCount: number
}

export function computeInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")
}

export async function setMyStatus(userId: string, status: string) {
  const updated = await updateUserStatus(userId, status)
  if (!updated) throw new NotFoundError("Pengguna")
  await publishRealtime({ rooms: [INBOX_ROOM], type: "presence:changed", data: { userId, status } })
  return updated
}

export async function getAgents(): Promise<AgentResponse[]> {
  const rows = await listAgents()
  return rows.map((a) => ({
    id: a.id,
    name: a.fullName,
    initials: computeInitials(a.fullName),
    status: a.status,
    avatarUrl: a.avatarUrl,
    activeConversationCount: a.activeConversationCount,
  }))
}
