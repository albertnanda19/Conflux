export interface WsClient {
  send(data: string): void
}

export const INBOX_ROOM = "inbox"
export const agentRoom = (userId: string) => `agent:${userId}`
export const conversationRoom = (conversationId: string) => `conversation:${conversationId}`

const rooms = new Map<string, Set<WsClient>>()
const clientRooms = new Map<WsClient, Set<string>>()

export function joinRoom(client: WsClient, room: string): void {
  let members = rooms.get(room)
  if (!members) {
    members = new Set()
    rooms.set(room, members)
  }
  members.add(client)

  let joined = clientRooms.get(client)
  if (!joined) {
    joined = new Set()
    clientRooms.set(client, joined)
  }
  joined.add(room)
}

export function leaveRoom(client: WsClient, room: string): void {
  const members = rooms.get(room)
  if (members) {
    members.delete(client)
    if (members.size === 0) rooms.delete(room)
  }
  clientRooms.get(client)?.delete(room)
}

export function registerClient(client: WsClient, joinRooms: string[]): void {
  for (const room of joinRooms) joinRoom(client, room)
}

export function unregisterClient(client: WsClient): void {
  const joined = clientRooms.get(client)
  if (joined) {
    for (const room of joined) {
      const members = rooms.get(room)
      if (members) {
        members.delete(client)
        if (members.size === 0) rooms.delete(room)
      }
    }
  }
  clientRooms.delete(client)
}

export function broadcast(targetRooms: string[], message: unknown): void {
  const recipients = new Set<WsClient>()
  for (const room of targetRooms) {
    const members = rooms.get(room)
    if (members) for (const client of members) recipients.add(client)
  }
  if (recipients.size === 0) return
  const payload = JSON.stringify(message)
  for (const client of recipients) {
    try {
      client.send(payload)
    } catch {
      unregisterClient(client)
    }
  }
}

export function roomSize(room: string): number {
  return rooms.get(room)?.size ?? 0
}
