import { describe, it, expect } from "vitest"
import {
  joinRoom,
  leaveRoom,
  registerClient,
  unregisterClient,
  broadcast,
  roomSize,
  INBOX_ROOM,
  agentRoom,
  conversationRoom,
  type WsClient,
} from "./ws"

function mockClient() {
  const sent: string[] = []
  const client: WsClient & { sent: string[] } = { sent, send: (d: string) => sent.push(d) }
  return client
}

describe("ws room helpers", () => {
  it("builds deterministic room keys", () => {
    expect(INBOX_ROOM).toBe("inbox")
    expect(agentRoom("u1")).toBe("agent:u1")
    expect(conversationRoom("c1")).toBe("conversation:c1")
  })
})

describe("ws registry", () => {
  it("broadcasts only to clients in target rooms", () => {
    const a = mockClient()
    const b = mockClient()
    const room = conversationRoom("ws-test-1")
    joinRoom(a, room)
    broadcast([room], { type: "message:new", data: { x: 1 } })
    expect(a.sent).toHaveLength(1)
    expect(b.sent).toHaveLength(0)
    expect(JSON.parse(a.sent[0]!)).toEqual({ type: "message:new", data: { x: 1 } })
    unregisterClient(a)
  })

  it("dedupes a client present in multiple target rooms", () => {
    const a = mockClient()
    const r1 = conversationRoom("ws-test-2a")
    const r2 = conversationRoom("ws-test-2b")
    registerClient(a, [r1, r2])
    broadcast([r1, r2], { type: "conversation:updated", data: {} })
    expect(a.sent).toHaveLength(1)
    unregisterClient(a)
  })

  it("removes client from all rooms on unregister", () => {
    const a = mockClient()
    const room = conversationRoom("ws-test-3")
    registerClient(a, [room, INBOX_ROOM])
    expect(roomSize(room)).toBe(1)
    unregisterClient(a)
    expect(roomSize(room)).toBe(0)
  })

  it("leaveRoom removes a single room subscription", () => {
    const a = mockClient()
    const room = conversationRoom("ws-test-4")
    joinRoom(a, room)
    leaveRoom(a, room)
    expect(roomSize(room)).toBe(0)
  })

  it("no-op broadcast when room empty", () => {
    expect(() => broadcast([conversationRoom("empty-room")], { type: "x" })).not.toThrow()
  })
})
