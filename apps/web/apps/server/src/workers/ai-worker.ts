import { Worker, Job } from "bullmq"
import { createRedisConnection } from "@/lib/redis"

let worker: Worker | null = null

export function startAiWorker() {
  worker = new Worker("ai-processing", async (job: Job) => {
    console.log(`[AiWorker] Memproses AI: ${job.id}`)
  }, { connection: createRedisConnection("worker") })
  console.log("[AiWorker] Dimulai")
}

export async function shutdownAiWorker() {
  if (worker) await worker.close()
}
