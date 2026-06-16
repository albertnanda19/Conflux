import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

redis.on("error", (err) => {
  console.error("[Redis] Koneksi gagal:", err.message)
})

redis.on("connect", () => {
  console.log("[Redis] Berhasil terhubung.")
})

export function createRedisConnection(): Redis {
  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  })
}
