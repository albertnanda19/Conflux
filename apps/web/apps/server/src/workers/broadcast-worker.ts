import { Worker, Job } from "bullmq"
import { createRedisConnection } from "@/lib/redis"

let worker: Worker | null = null

export function startBroadcastWorker() {
  worker = new Worker("broadcast-sending", async (job: Job) => {
    console.log(`[BroadcastWorker] Mengirim siaran: ${job.id}`)
  }, { connection: createRedisConnection("worker") })
  console.log("[BroadcastWorker] Dimulai")
}

export async function shutdownBroadcastWorker() {
  if (worker) await worker.close()
}
