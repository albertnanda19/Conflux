import { Worker, Job } from "bullmq"
import { createRedisConnection } from "@/lib/redis"

let worker: Worker | null = null

export function startDocumentWorker() {
  worker = new Worker("document-processing", async (job: Job) => {
    console.log(`[DocumentWorker] Memproses dokumen: ${job.id}`)
  }, { connection: createRedisConnection("worker") })
  console.log("[DocumentWorker] Dimulai")
}

export async function shutdownDocumentWorker() {
  if (worker) await worker.close()
}
