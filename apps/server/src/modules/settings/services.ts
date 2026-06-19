import * as q from "./queries"
import { NotFoundError } from "@/lib/errors"
import type { ProviderResponse, UpdateProviderInput } from "./types"

function toProviderResponse(row: Awaited<ReturnType<typeof q.listProviders>>[number]): ProviderResponse {
  const hasKey = Boolean(process.env[row.envKeyName])
  let status: ProviderResponse["status"]
  if (!row.isEnabled) status = "disabled"
  else if (!hasKey) status = "error"
  else status = row.priority === 1 ? "active" : "fallback"
  return {
    id: row.id,
    name: row.name,
    model: row.model,
    priority: row.priority,
    maxTokens: row.maxTokens,
    temperature: row.temperature,
    isEnabled: row.isEnabled,
    status,
    hasKey,
  }
}

export async function getAiSettings() {
  const [settings, providers] = await Promise.all([q.getOrCreateSettings(), q.listProviders()])
  return {
    aiEnabled: settings.aiEnabled,
    providers: providers.map(toProviderResponse),
  }
}

export async function updateAiEnabled(aiEnabled: boolean) {
  const settings = await q.updateAiEnabled(aiEnabled)
  return { aiEnabled: settings.aiEnabled }
}

export async function updateProvider(id: string, input: UpdateProviderInput) {
  const existing = await q.findProviderById(id)
  if (!existing) throw new NotFoundError("Provider AI")
  const updated = await q.updateProvider(id, input)
  return toProviderResponse(updated)
}
