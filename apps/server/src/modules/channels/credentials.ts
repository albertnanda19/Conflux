import { decryptCredentials } from "@/lib/crypto"

const ENV_TOKEN: Record<string, { env: string; field: string }> = {
  telegram_bot: { env: "TELEGRAM_BOT_TOKEN", field: "botToken" },
  whatsapp_fonnte: { env: "FONNTE_TOKEN", field: "apiToken" },
}

export function resolveCredentials(provider: string, stored: unknown): Record<string, unknown> {
  const base = (decryptCredentials(stored) as Record<string, unknown> | null) ?? {}
  const map = ENV_TOKEN[provider]
  if (map && process.env[map.env]) {
    return { ...base, [map.field]: process.env[map.env] }
  }
  return base
}
