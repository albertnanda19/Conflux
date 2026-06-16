import { Worker } from "bullmq"

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" }

let worker: Worker | null = null

export function startAiWorker() {
  worker = new Worker("ai-queue", async (job) => {
    console.log(`[AiWorker] Memproses job ${job.id}:`, job.data)
  }, { connection })
  worker.on("failed", (job, err) => {
    console.error(`[AiWorker] Job ${job?.id} gagal:`, err.message)
  })
  console.log("[AiWorker] Worker AI aktif.")
}

export async function shutdownAiWorker() {
  if (worker) await worker.close()
}
