import { startMessageWorker, shutdownMessageWorker } from "./message-worker"
import { startAiWorker, shutdownAiWorker } from "./ai-worker"
import { startDocumentWorker, shutdownDocumentWorker } from "./document-worker"
import { startBroadcastWorker, shutdownBroadcastWorker } from "./broadcast-worker"

export function startWorkers() {
  startMessageWorker()
  startAiWorker()
  startDocumentWorker()
  startBroadcastWorker()
  console.log("[Workers] Semua worker dimulai")
}

export async function shutdownWorkers() {
  await Promise.all([
    shutdownMessageWorker(),
    shutdownAiWorker(),
    shutdownDocumentWorker(),
    shutdownBroadcastWorker(),
  ])
  console.log("[Workers] Semua worker dimatikan")
}
