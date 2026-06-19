import { startMessageWorker, shutdownMessageWorker } from "./message-worker"
import { startAiWorker, shutdownAiWorker } from "./ai-worker"
import { startDocumentWorker, shutdownDocumentWorker } from "./document-worker"
import { startBroadcastWorker, shutdownBroadcastWorker } from "./broadcast-worker"
import { startTelegramPoller, stopTelegramPoller } from "./telegram-poller"

export function startWorkers() {
  startMessageWorker()
  startAiWorker()
  startDocumentWorker()
  startBroadcastWorker()
  void startTelegramPoller()
  console.log("[Workers] Semua worker dimulai")
}

export async function shutdownWorkers() {
  await Promise.all([
    shutdownMessageWorker(),
    shutdownAiWorker(),
    shutdownDocumentWorker(),
    shutdownBroadcastWorker(),
    stopTelegramPoller(),
  ])
  console.log("[Workers] Semua worker dimatikan")
}
