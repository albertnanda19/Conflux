import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { apiRoutes } from "./routes"
import { errorHandler } from "./middleware/error-handler"
import { redis } from "./lib/redis"
import { startWorkers, shutdownWorkers } from "./workers"

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
  .use(apiRoutes)
  .listen(PORT)

console.log(`[Server] Berjalan di http://localhost:${PORT}`)

startWorkers()

const gracefulShutdown = async () => {
  console.log("[Server] Mematikan server...")
  await shutdownWorkers()
  await redis.quit()
  app.stop()
  process.exit(0)
}

process.on("SIGINT", gracefulShutdown)
process.on("SIGTERM", gracefulShutdown)

export type App = typeof app
