import type { ChannelAdapter, ChannelProvider } from "./adapter"
import { BadRequestError } from "@/lib/errors"
import { whatsappCloudAdapter } from "./providers/whatsapp-cloud"
import { whatsappFonnteAdapter } from "./providers/whatsapp-fonnte"
import { telegramAdapter } from "./providers/telegram"
import { instagramAdapter } from "./providers/instagram"
import { facebookAdapter } from "./providers/facebook"
import { livechatAdapter } from "./providers/livechat"
import { simulatorAdapter } from "./providers/simulator"

const adapters: Record<ChannelProvider, ChannelAdapter> = {
  whatsapp_cloud: whatsappCloudAdapter,
  whatsapp_fonnte: whatsappFonnteAdapter,
  telegram_bot: telegramAdapter,
  instagram: instagramAdapter,
  facebook: facebookAdapter,
  livechat: livechatAdapter,
  simulator: simulatorAdapter,
}

export function getAdapter(provider: ChannelProvider): ChannelAdapter {
  const adapter = adapters[provider]
  if (!adapter) throw new BadRequestError(`Provider channel tidak dikenal: ${provider}`)
  return adapter
}
