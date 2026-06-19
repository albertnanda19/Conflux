import { db } from "./db"
import {
  users,
  channels,
  labels,
  quickReplies,
  contacts,
  contactChannels,
  contactActivities,
  conversations,
  conversationLabels,
  messages,
  aiSettings,
  aiProviders,
  aiAssistants,
} from "./schema"
import { hashPassword } from "./auth"

const now = Date.now()
const minutesAgo = (m: number) => new Date(now - m * 60_000)
const hoursAgo = (h: number) => new Date(now - h * 3_600_000)
const daysAgo = (d: number) => new Date(now - d * 86_400_000)

async function seed() {
  console.log("[Seed] Memulai pengisian data awal...")

  const existing = await db.select().from(users).limit(1)
  if (existing.length > 0) {
    console.log("[Seed] Data sudah ada. Melewati proses seed.")
    process.exit(0)
  }

  const password = await hashPassword("password123")

  const [admin, sari, rizki, nina] = await db
    .insert(users)
    .values([
      { email: "admin@test.com", passwordHash: password, fullName: "Admin User", role: "super_admin", status: "online" },
      { email: "sari@test.com", passwordHash: password, fullName: "Sari Dewi", role: "agent", status: "online" },
      { email: "rizki@test.com", passwordHash: password, fullName: "Rizki Pratama", role: "agent", status: "busy" },
      { email: "nina@test.com", passwordHash: password, fullName: "Nina Kusuma", role: "agent", status: "offline" },
    ])
    .returning()

  const [waCloud, waFonnte, ig, fb] = await db
    .insert(channels)
    .values([
      { name: "WhatsApp Official", type: "whatsapp", provider: "whatsapp_cloud", isActive: true },
      { name: "WhatsApp Fonnte", type: "whatsapp", provider: "whatsapp_fonnte", isActive: true },
      { name: "Instagram Acme", type: "instagram", provider: "instagram", isActive: true },
      { name: "Facebook Acme", type: "facebook", provider: "facebook", isActive: true },
    ])
    .returning()

  const insertedLabels = await db
    .insert(labels)
    .values([
      { name: "Minat Data Science", color: "#4A7AFF", createdBy: admin.id },
      { name: "Minat UX Design", color: "#E84393", createdBy: admin.id },
      { name: "Follow Up", color: "#FF6B5A", createdBy: admin.id },
      { name: "Siap Daftar", color: "#10B981", createdBy: admin.id },
      { name: "Dari IG Ads", color: "#7C3AED", createdBy: admin.id },
      { name: "Dari WA Organik", color: "#25D366", createdBy: admin.id },
    ])
    .returning()
  const [lDS, lUX, lFollow, lReady, lIgAds, lWaOrg] = insertedLabels

  await db.insert(quickReplies).values([
    { shortcut: "/sapa", name: "Sapaan Standar", category: "Sapaan", content: "Halo Kak {nama}! Selamat datang di Acme Learning. Ada yang bisa saya bantu?", createdBy: admin.id },
    { shortcut: "/harga", name: "Info Harga", category: "Info Program", content: "Untuk informasi harga program kami:\n• Data Science: Rp 4.500.000\n• Full-Stack Web Dev: Rp 5.200.000\n• UX Design: Rp 3.800.000\n\nSemua sudah termasuk materi, project, dan sertifikat.", createdBy: admin.id },
    { shortcut: "/jadwal", name: "Jadwal Batch", category: "Info Program", content: "Batch selanjutnya mulai tanggal 15 Juli 2026. Untuk early bird ada diskon 10% jika mendaftar sebelum 30 Juni.", createdBy: admin.id },
    { shortcut: "/followup", name: "Follow Up", category: "Follow Up", content: "Halo Kak {nama}, apa sudah ada keputusan terkait program yang diminati? Kami masih membuka pendaftaran untuk batch Juli.", createdBy: admin.id },
    { shortcut: "/closing", name: "Closing", category: "Closing", content: "Baik Kak {nama}! Untuk mendaftar, Kakak bisa langsung klik link berikut: [LINK_DAFTAR].", createdBy: admin.id },
  ])

  const [rina, budi, maya, ahmad, dewi] = await db
    .insert(contacts)
    .values([
      { fullName: "Rina Sari", phoneNumber: "+6281234567890", pipelineStatus: "qualified", source: "whatsapp", sourceChannelId: waCloud.id, assignedAgentId: sari.id, createdAt: daysAgo(5) },
      { fullName: "Budi Pratama", phoneNumber: "+6281398765432", pipelineStatus: "contacted", source: "whatsapp", sourceChannelId: waFonnte.id, assignedAgentId: sari.id, createdAt: daysAgo(3) },
      { fullName: "Maya Putri", email: "maya.putri@email.com", pipelineStatus: "new_lead", source: "instagram", sourceChannelId: ig.id, assignedAgentId: rizki.id, createdAt: daysAgo(1) },
      { fullName: "Ahmad Fauzi", pipelineStatus: "new_lead", source: "facebook", sourceChannelId: fb.id, createdAt: daysAgo(2) },
      { fullName: "Dewi Lestari", phoneNumber: "+6282155667788", notes: "Sudah daftar program Data Science Batch 12. Pembayaran lunas.", pipelineStatus: "closed_won", source: "whatsapp", sourceChannelId: waCloud.id, assignedAgentId: nina.id, createdAt: daysAgo(14) },
    ])
    .returning()

  await db.insert(contactChannels).values([
    { contactId: rina.id, channelType: "whatsapp", channelIdentifier: "+6281234567890", isPrimary: true },
    { contactId: budi.id, channelType: "whatsapp", channelIdentifier: "+6281398765432", isPrimary: true },
    { contactId: maya.id, channelType: "instagram", channelIdentifier: "@mayaptr", isPrimary: true },
    { contactId: ahmad.id, channelType: "facebook", channelIdentifier: "ahmad.fauzi.fb", isPrimary: true },
    { contactId: dewi.id, channelType: "whatsapp", channelIdentifier: "+6282155667788", isPrimary: true },
  ])

  await db.insert(contactActivities).values([
    { contactId: rina.id, type: "message_sent", description: "Rina mengirim pesan pertama", createdAt: daysAgo(5) },
    { contactId: rina.id, type: "assignment", description: "Ditugaskan ke Sari Dewi", agentId: sari.id, agentName: "Sari Dewi", createdAt: daysAgo(5) },
    { contactId: rina.id, type: "status_change", description: "Status diubah ke Qualified", createdAt: daysAgo(3) },
    { contactId: budi.id, type: "ai_handoff", description: "AI menyerahkan ke human agent", createdAt: daysAgo(3) },
    { contactId: dewi.id, type: "status_change", description: "Status diubah ke Closed Won", agentId: nina.id, agentName: "Nina Kusuma", createdAt: daysAgo(8) },
  ])

  const [conv1, conv2, conv3, conv4, conv5] = await db
    .insert(conversations)
    .values([
      { contactId: rina.id, channelId: waCloud.id, status: "open", priority: "high", isAiHandling: true, unreadCount: 2, lastMessagePreview: "Kalau program Data Science-nya berapa biayanya ya?", lastMessageAt: minutesAgo(2), createdAt: daysAgo(5) },
      { contactId: budi.id, channelId: waFonnte.id, agentId: sari.id, status: "open", priority: "medium", isAiHandling: false, unreadCount: 0, lastMessagePreview: "Baik Kak, saya tunggu info jadwal batch selanjutnya", lastMessageAt: minutesAgo(15), createdAt: daysAgo(3) },
      { contactId: maya.id, channelId: ig.id, agentId: rizki.id, status: "pending", priority: "medium", isAiHandling: false, unreadCount: 1, lastMessagePreview: "Halo kak, mau tanya soal bootcamp UX Design dong", lastMessageAt: minutesAgo(45), createdAt: daysAgo(1) },
      { contactId: ahmad.id, channelId: fb.id, status: "open", priority: "high", isAiHandling: true, unreadCount: 3, lastMessagePreview: "Ada diskon ngga kalau daftar rame-rame?", lastMessageAt: hoursAgo(1), createdAt: daysAgo(2) },
      { contactId: dewi.id, channelId: waCloud.id, agentId: nina.id, status: "resolved", priority: "low", isAiHandling: false, unreadCount: 0, lastMessagePreview: "Terima kasih banyak kak, sudah daftar!", lastMessageAt: daysAgo(3), createdAt: daysAgo(14) },
    ])
    .returning()

  await db.insert(conversationLabels).values([
    { conversationId: conv1.id, labelId: lDS.id },
    { conversationId: conv1.id, labelId: lFollow.id },
    { conversationId: conv2.id, labelId: lUX.id },
    { conversationId: conv3.id, labelId: lUX.id },
    { conversationId: conv3.id, labelId: lIgAds.id },
    { conversationId: conv4.id, labelId: lDS.id },
    { conversationId: conv5.id, labelId: lReady.id },
    { conversationId: conv5.id, labelId: lWaOrg.id },
  ])

  await db.insert(messages).values([
    { conversationId: conv1.id, direction: "inbound", senderType: "contact", senderId: rina.id, contentType: "text", content: { text: "Halo kak, saya mau tanya-tanya soal program" }, status: "read", createdAt: minutesAgo(20) },
    { conversationId: conv1.id, direction: "outbound", senderType: "ai", contentType: "text", content: { text: "Halo Kak Rina! Selamat datang 👋 Program mana yang Kakak minati?" }, status: "delivered", createdAt: minutesAgo(19) },
    { conversationId: conv1.id, direction: "outbound", senderType: "ai", contentType: "document", content: { text: "Ini brosur program Data Science-nya kak 📎", fileName: "Brochure-DataScience-2026.pdf", fileSize: "2.4 MB" }, status: "delivered", createdAt: minutesAgo(8) },
    { conversationId: conv1.id, direction: "inbound", senderType: "contact", senderId: rina.id, contentType: "text", content: { text: "Kalau program Data Science-nya berapa biayanya ya?" }, status: "delivered", createdAt: minutesAgo(2) },
    { conversationId: conv2.id, direction: "inbound", senderType: "contact", senderId: budi.id, contentType: "text", content: { text: "Kak, mau tanya kapan batch selanjutnya mulai?" }, status: "read", createdAt: minutesAgo(45) },
    { conversationId: conv2.id, direction: "outbound", senderType: "agent", senderId: sari.id, contentType: "text", content: { text: "Halo Kak Budi! Batch berikutnya mulai tanggal 15 Juli 2026." }, status: "read", createdAt: minutesAgo(40) },
    { conversationId: conv2.id, direction: "inbound", senderType: "contact", senderId: budi.id, contentType: "text", content: { text: "Baik Kak, saya tunggu info jadwal batch selanjutnya" }, status: "read", createdAt: minutesAgo(15) },
    { conversationId: conv4.id, direction: "inbound", senderType: "contact", senderId: ahmad.id, contentType: "location", content: { location: { lat: -6.2088, lng: 106.8456, name: "Acme Learning Center, Jakarta Selatan" } }, status: "delivered", createdAt: minutesAgo(58) },
    { conversationId: conv4.id, direction: "inbound", senderType: "contact", senderId: ahmad.id, contentType: "text", content: { text: "Ada diskon ngga kalau daftar rame-rame?" }, status: "sent", createdAt: minutesAgo(30) },
  ])

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
    {
      name: "Asisten Default", description: "AI Assistant bawaan sistem untuk agen yang belum memiliki AI Assistant khusus.", avatar: "⚡", status: "active", isDefault: true,
      personaName: "Asisten PSC", personaLanguage: "Bahasa Indonesia", personaTone: "semi-formal",
      systemPrompt: "Anda adalah asisten virtual Acme Learning yang membantu calon pelanggan dengan ramah dan informatif.",
      workingHours: defaultWorkingHours, handoffConfig: defaultHandoffConfig, kbScope: "global", customKbDocumentIds: [], createdBy: admin.id,
    },
    {
      name: "Asisten Closing", description: "AI Assistant fokus konversi untuk tim sales.", avatar: "🎯", status: "active",
      personaName: "Asisten Closing", personaLanguage: "Bahasa Indonesia", personaTone: "casual",
      systemPrompt: "Anda adalah asisten sales yang antusias namun sopan, fokus membantu lead menyelesaikan pendaftaran.",
      workingHours: defaultWorkingHours, handoffConfig: defaultHandoffConfig, kbScope: "global", customKbDocumentIds: [], assignedAgentId: sari.id, createdBy: admin.id,
    },
    {
      name: "Asisten Support", description: "AI Assistant untuk pertanyaan teknis dan dukungan.", avatar: "🛠️", status: "draft",
      personaName: "Asisten Support", personaLanguage: "Bahasa Indonesia", personaTone: "formal",
      systemPrompt: "Anda adalah asisten dukungan teknis yang sabar dan teliti dalam menjawab pertanyaan pelanggan.",
      workingHours: defaultWorkingHours, handoffConfig: defaultHandoffConfig, kbScope: "global", customKbDocumentIds: [], createdBy: admin.id,
    },
  ])

  console.log("[Seed] Data awal berhasil dibuat.")
  console.log("[Seed] Login: admin@test.com / password123 (super_admin)")
  console.log("[Seed] Login: sari@test.com / password123 (agent)")
  console.log(`[Seed] ${insertedLabels.length} label, 4 channel (incl. WA official + Fonnte), 5 kontak, 5 percakapan.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error("[Seed] Gagal mengisi data awal:", err)
  process.exit(1)
})
