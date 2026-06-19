import { redis, createRedisConnection } from "./redis"
import type Redis from "ioredis"

export const REALTIME_CHANNEL = "realtime:events"

export type RealtimeEventType =
  | "message:new"
  | "message:status"
  | "conversation:updated"
  | "conversation:assigned"
  | "presence:changed"
  | "notification:new"

export type RealtimeEvent = {
  rooms: string[]
  type: RealtimeEventType
  data: unknown
}

export async function publishRealtime(event: RealtimeEvent): Promise<void> {
  await redis.publish(REALTIME_CHANNEL, JSON.stringify(event))
}

let subscriber: Redis | null = null

export function startRealtimeSubscriber(onEvent: (event: RealtimeEvent) => void): void {
  subscriber = createRedisConnection()
  subscriber.subscribe(REALTIME_CHANNEL, (err) => {
    if (err) console.error("[PubSub] Gagal subscribe:", err.message)
    else console.log("[PubSub] Subscriber realtime aktif.")
  })
  subscriber.on("message", (_channel, raw) => {
    try {
      onEvent(JSON.parse(raw) as RealtimeEvent)
    } catch (err) {
      console.error("[PubSub] Pesan tidak valid:", (err as Error).message)
    }
  })
}

export async function stopRealtimeSubscriber(): Promise<void> {
  if (subscriber) {
    await subscriber.quit()
    subscriber = null
  }
}
