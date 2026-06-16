import { Worker, Job } from "bullmq"
import { createRedisConnection } from "@/lib/redis"

let worker: Worker | null = null

export function startMessageWorker() {
  worker = new Worker("message-processing", async (job: Job) => {
    console.log(`[MessageWorker] Memproses pesan: ${job.id}`)
  }, { connection: createRedisConnection("worker") })
  console.log("[MessageWorker] Dimulai")
}

export async function shutdownMessageWorker() {
  if (worker) await worker.close()
}
