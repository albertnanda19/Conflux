import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { apiRoutes } from "./routes"
import { errorHandler } from "./middleware/error-handler"
import { redis } from "./lib/redis"
import { startWorkers, shutdownWorkers } from "./workers"
import { verifyToken } from "./lib/auth"
import {
  registerClient,
  unregisterClient,
  joinRoom,
  leaveRoom,
  broadcast,
  INBOX_ROOM,
  agentRoom,
  conversationRoom,
  type WsClient,
} from "./lib/ws"
import { startRealtimeSubscriber, stopRealtimeSubscriber } from "./lib/pubsub"
import { handleTelegramWebhook } from "./modules/channels/telegram-webhook"
import { handleFonnteWebhook } from "./modules/channels/fonnte-webhook"
import { ensureBucket } from "./lib/storage"

type WsMessage = { action?: "subscribe" | "unsubscribe"; conversationId?: string }

function parseWsMessage(raw: unknown): WsMessage | null {
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as WsMessage
    } catch {
      return null
    }
  }
  if (raw && typeof raw === "object") return raw as WsMessage
  return null
}

const PORT = Number(process.env.PORT) || 3000

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    })
  )
  .onError(errorHandler)
  .get("/health", () => ({
    success: true,
    message: "Server berjalan dengan normal",
    timestamp: new Date().toISOString(),
  }))
  .post("/webhooks/telegram/:channelId", ({ params, body, headers }) =>
    handleTelegramWebhook(params.channelId, body, headers as Record<string, string | undefined>),
  )
  .post("/webhooks/fonnte/:channelId", ({ params, body }) => handleFonnteWebhook(params.channelId, body))
  .ws("/ws", {
    async open(ws) {
      const token = (ws.data.query as Record<string, string | undefined> | undefined)?.token
      let payload = null
      try {
        payload = token ? await verifyToken(token) : null
      } catch {
        payload = null
      }
      if (!payload) {
        ws.close()
        return
      }
      const client = ws.raw as unknown as WsClient
      registerClient(client, [INBOX_ROOM, agentRoom(payload.sub)])
    },
    message(ws, message) {
      const client = ws.raw as unknown as WsClient
      const parsed = parseWsMessage(message)
      if (!parsed?.conversationId) return
      if (parsed.action === "subscribe") joinRoom(client, conversationRoom(parsed.conversationId))
      else if (parsed.action === "unsubscribe") leaveRoom(client, conversationRoom(parsed.conversationId))
    },
    close(ws) {
      unregisterClient(ws.raw as unknown as WsClient)
    },
  })
  .use(apiRoutes)
  .listen(PORT)

console.log(`[Server] Berjalan di http://localhost:${PORT}`)

startWorkers()

ensureBucket().catch((err) => console.error("[Storage] Gagal menyiapkan bucket:", (err as Error).message))

startRealtimeSubscriber((event) => {
  broadcast(event.rooms, { type: event.type, data: event.data })
})

const gracefulShutdown = async () => {
  console.log("[Server] Mematikan server...")
  await stopRealtimeSubscriber()
  await shutdownWorkers()
  await redis.quit()
  app.stop()
  process.exit(0)
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

export type App = typeof app
