import { db } from "./db"
import { users, aiSettings, aiProviders, aiAssistants } from "./schema"
import { eq } from "drizzle-orm"

async function seedAi() {
  const existing = await db.select().from(aiProviders).limit(1)
  if (existing.length > 0) {
    console.log("[SeedAI] Data AI sudah ada. Melewati.")
    process.exit(0)
  }

  const [admin] = await db.select().from(users).where(eq(users.role, "super_admin")).limit(1)
  const [sari] = await db.select().from(users).where(eq(users.email, "sari@test.com")).limit(1)

  await db.insert(aiSettings).values({ aiEnabled: true })

  await db.insert(aiProviders).values([
    { name: "Google Gemini", model: "gemini-1.5-flash", priority: 1, maxTokens: 1024, temperature: 0.7, isEnabled: true, envKeyName: "GEMINI_API_KEY" },
    { name: "OpenRouter", model: "meta-llama/llama-3.1-8b-instruct", priority: 2, maxTokens: 1024, temperature: 0.7, isEnabled: true, envKeyName: "OPENROUTER_API_KEY" },
    { name: "OpenAI", model: "gpt-4o-mini", priority: 3, maxTokens: 1024, temperature: 0.7, isEnabled: false, envKeyName: "OPENAI_API_KEY" },
  ])

  const defaultWorkingHours = {
    timezone: "Asia/Jakarta (WIB, UTC+7)",
    days: [
      { day: "monday", dayLabel: "Senin", enabled: true, start: "08:00", end: "17:00" },
      { day: "tuesday", dayLabel: "Selasa", enabled: true, start: "08:00", end: "17:00" },
      { day: "wednesday", dayLabel: "Rabu", enabled: true, start: "08:00", end: "17:00" },
      { day: "thursday", dayLabel: "Kamis", enabled: true, start: "08:00", end: "17:00" },
      { day: "friday", dayLabel: "Jumat", enabled: true, start: "08:00", end: "17:00" },
      { day: "saturday", dayLabel: "Sabtu", enabled: true, start: "09:00", end: "14:00" },
      { day: "sunday", dayLabel: "Minggu", enabled: false, start: "09:00", end: "14:00" },
    ],
    oooMessage: "Terima kasih telah menghubungi kami. Tim kami sedang di luar jam kerja dan akan membalas pesan Anda secepatnya.",
  }

  const defaultHandoffConfig = {
    triggerKeywords: ["daftar", "bayar", "mau beli", "cara daftar", "transfer ke mana", "nomor rekening", "jadwal demo", "konsultasi"],
    conversionSignals: [
      { id: "cs-1", type: "keyword", description: "Lead menyebut kata kunci konversi (daftar, bayar)", enabled: true },
      { id: "cs-2", type: "sentiment", description: "Sentimen positif kuat + pertanyaan spesifik enrollment", enabled: true },
      { id: "cs-3", type: "behavior", description: "Lead meminta nomor rekening atau detail pembayaran", enabled: true },
    ],
    handoffMessage: "Terima kasih atas ketertarikan Anda! Saya akan menghubungkan Anda dengan tim kami sebentar lagi.",
    maxAiMessages: 10,
    priorityNotification: true,
  }

  await db.insert(aiAssistants).values([
    { name: "Asisten Default", description: "AI Assistant bawaan sistem untuk agen yang belum memiliki AI Assistant khusus.", avatar: "⚡", status: "active", isDefault: true, personaName: "Asisten PSC", personaLanguage: "Bahasa Indonesia", personaTone: "semi-formal", systemPrompt: "Anda adalah asisten virtual Acme Learning yang membantu calon pelanggan dengan ramah dan informatif.", workingHours: defaultWorkingHours, handoffConfig: defaultHandoffConfig, kbScope: "global", customKbDocumentIds: [], createdBy: admin?.id },
    { name: "Asisten Closing", description: "AI Assistant fokus konversi untuk tim sales.", avatar: "🎯", status: "active", personaName: "Asisten Closing", personaLanguage: "Bahasa Indonesia", personaTone: "casual", systemPrompt: "Anda adalah asisten sales yang antusias namun sopan, fokus membantu lead menyelesaikan pendaftaran.", workingHours: defaultWorkingHours, handoffConfig: defaultHandoffConfig, kbScope: "global", customKbDocumentIds: [], assignedAgentId: sari?.id, createdBy: admin?.id },
    { name: "Asisten Support", description: "AI Assistant untuk pertanyaan teknis dan dukungan.", avatar: "🛠️", status: "draft", personaName: "Asisten Support", personaLanguage: "Bahasa Indonesia", personaTone: "formal", systemPrompt: "Anda adalah asisten dukungan teknis yang sabar dan teliti dalam menjawab pertanyaan pelanggan.", workingHours: defaultWorkingHours, handoffConfig: defaultHandoffConfig, kbScope: "global", customKbDocumentIds: [], createdBy: admin?.id },
  ])

  console.log("[SeedAI] Data AI berhasil dibuat (3 provider, 3 AI Assistant, 1 settings).")
  process.exit(0)
}

seedAi().catch((err) => {
  console.error("[SeedAI] Gagal:", err)
  process.exit(1)
})
