import { Worker } from "bullmq"

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" }

let worker: Worker | null = null

export function startMessageWorker() {
  worker = new Worker("message-queue", async (job) => {
    console.log(`[MessageWorker] Memproses job ${job.id}:`, job.data)
  }, { connection })
  worker.on("failed", (job, err) => {
    console.error(`[MessageWorker] Job ${job?.id} gagal:`, err.message)
  })
  console.log("[MessageWorker] Worker pesan aktif.")
}

export async function shutdownMessageWorker() {
  if (worker) await worker.close()
}
