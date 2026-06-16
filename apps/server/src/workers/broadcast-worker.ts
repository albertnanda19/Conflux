import { Worker } from "bullmq"

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" }

let worker: Worker | null = null

export function startBroadcastWorker() {
  worker = new Worker("broadcast-queue", async (job) => {
    console.log(`[BroadcastWorker] Memproses job ${job.id}:`, job.data)
  }, { connection })
  worker.on("failed", (job, err) => {
    console.error(`[BroadcastWorker] Job ${job?.id} gagal:`, err.message)
  })
  console.log("[BroadcastWorker] Worker broadcast aktif.")
}

export async function shutdownBroadcastWorker() {
  if (worker) await worker.close()
}
