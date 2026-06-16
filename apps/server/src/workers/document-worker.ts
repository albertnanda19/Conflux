import { Worker } from "bullmq"

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" }

let worker: Worker | null = null

export function startDocumentWorker() {
  worker = new Worker("document-queue", async (job) => {
    console.log(`[DocumentWorker] Memproses job ${job.id}:`, job.data)
  }, { connection })
  worker.on("failed", (job, err) => {
    console.error(`[DocumentWorker] Job ${job?.id} gagal:`, err.message)
  })
  console.log("[DocumentWorker] Worker dokumen aktif.")
}

export async function shutdownDocumentWorker() {
  if (worker) await worker.close()
}
