import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  real,
  timestamp,
  jsonb,
  vector,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("agent"),
  status: varchar("status", { length: 20 }).notNull().default("offline"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const channels = pgTable("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 50 }).notNull(),
  credentials: jsonb("credentials"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("channels_provider_idx").on(table.provider),
  index("channels_type_idx").on(table.type),
])

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
  phoneNumber: varchar("phone_number", { length: 50 }),
  email: varchar("email", { length: 255 }),
  notes: text("notes"),
  pipelineStatus: varchar("pipeline_status", { length: 50 }).default("new_lead").notNull(),
  source: varchar("source", { length: 50 }),
  sourceChannelId: uuid("source_channel_id"),
  assignedAgentId: uuid("assigned_agent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("contacts_phone_idx").on(table.phoneNumber),
  index("contacts_pipeline_idx").on(table.pipelineStatus),
  index("contacts_assigned_idx").on(table.assignedAgentId),
])

export const contactChannels = pgTable("contact_channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
  channelType: varchar("channel_type", { length: 50 }).notNull(),
  channelIdentifier: varchar("channel_identifier", { length: 255 }).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("contact_channels_identifier_idx").on(table.channelType, table.channelIdentifier),
])

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
  channelId: uuid("channel_id").notNull().references(() => channels.id),
  agentId: uuid("agent_id"),
  aiAssistantId: uuid("ai_assistant_id").references(() => aiAssistants.id, { onDelete: "set null" }),
  status: varchar("status", { length: 20 }).default("open").notNull(),
  priority: varchar("priority", { length: 20 }).default("medium").notNull(),
  isAiHandling: boolean("is_ai_handling").default(false).notNull(),
  unreadCount: integer("unread_count").default(0).notNull(),
  lastMessagePreview: text("last_message_preview"),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("conversations_contact_idx").on(table.contactId),
  index("conversations_agent_idx").on(table.agentId),
  index("conversations_status_idx").on(table.status),
  index("conversations_priority_idx").on(table.priority),
  index("conversations_last_msg_idx").on(table.lastMessageAt),
])

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  direction: varchar("direction", { length: 10 }).notNull(),
  senderType: varchar("sender_type", { length: 20 }).notNull(),
  senderId: varchar("sender_id", { length: 255 }),
  contentType: varchar("content_type", { length: 20 }).default("text").notNull(),
  content: jsonb("content").notNull(),
  status: varchar("status", { length: 20 }).default("sent").notNull(),
  externalMessageId: varchar("external_message_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("messages_conversation_idx").on(table.conversationId),
  index("messages_created_idx").on(table.createdAt),
])

export const labels = pgTable("labels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const conversationLabels = pgTable("conversation_labels", {
  conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  labelId: uuid("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("conv_labels_unique_idx").on(table.conversationId, table.labelId),
])

export const contactActivities = pgTable("contact_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 30 }).notNull(),
  description: text("description").notNull(),
  agentId: uuid("agent_id"),
  agentName: varchar("agent_name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("contact_activities_contact_idx").on(table.contactId),
  index("contact_activities_created_idx").on(table.createdAt),
])

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 30 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  conversationId: uuid("conversation_id"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("notifications_user_created_idx").on(table.userId, table.createdAt),
  index("notifications_user_read_idx").on(table.userId, table.isRead),
])

export const quickReplies = pgTable("quick_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  shortcut: varchar("shortcut", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("quick_replies_category_idx").on(table.category),
])

export const aiAssistants = pgTable("ai_assistants", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  avatar: varchar("avatar", { length: 50 }),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  personaName: varchar("persona_name", { length: 255 }),
  personaLanguage: varchar("persona_language", { length: 100 }),
  personaTone: varchar("persona_tone", { length: 20 }).default("semi-formal").notNull(),
  systemPrompt: text("system_prompt"),
  workingHours: jsonb("working_hours"),
  handoffConfig: jsonb("handoff_config"),
  kbScope: varchar("kb_scope", { length: 20 }).default("global").notNull(),
  customKbDocumentIds: jsonb("custom_kb_document_ids").default([]).notNull(),
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id, { onDelete: "set null" }),
  isDefault: boolean("is_default").default(false).notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("ai_assistants_status_idx").on(table.status),
  uniqueIndex("ai_assistants_assigned_agent_idx").on(table.assignedAgentId),
])

export const aiProviders = pgTable("ai_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  priority: integer("priority").notNull(),
  maxTokens: integer("max_tokens").default(1024).notNull(),
  temperature: real("temperature").default(0.7).notNull(),
  isEnabled: boolean("is_enabled").default(true).notNull(),
  envKeyName: varchar("env_key_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("ai_providers_priority_idx").on(table.priority),
])

export const aiSettings = pgTable("ai_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  aiEnabled: boolean("ai_enabled").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const kbDocuments = pgTable("kb_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  content: text("content"),
  embedding: vector("embedding", { dimensions: 768 }),
  isActive: boolean("is_active").default(true).notNull(),
  aiAssistantId: uuid("ai_assistant_id").references(() => aiAssistants.id, { onDelete: "cascade" }),
  originalFileUrl: text("original_file_url"),
  fileType: varchar("file_type", { length: 50 }),
  fileSize: integer("file_size"),
  chunkIndex: integer("chunk_index"),
  chunkCount: integer("chunk_count"),
  sourceDocumentId: uuid("source_document_id"),
  processingStatus: varchar("processing_status", { length: 20 }).default("pending").notNull(),
  createdBy: uuid("created_by"),
  createdByName: varchar("created_by_name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("kb_category_idx").on(table.category),
  index("kb_processing_idx").on(table.processingStatus),
  index("kb_source_idx").on(table.sourceDocumentId),
  index("kb_assistant_idx").on(table.aiAssistantId),
  index("kb_embedding_idx").using("hnsw", table.embedding.op("vector_cosine_ops")),
])

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  channelId: uuid("channel_id").references(() => channels.id),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  totalRecipients: integer("total_recipients").default(0).notNull(),
  sentCount: integer("sent_count").default(0).notNull(),
  deliveredCount: integer("delivered_count").default(0).notNull(),
  readCount: integer("read_count").default(0).notNull(),
  repliedCount: integer("replied_count").default(0).notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  content: jsonb("content").notNull(),
  mediaUrl: text("media_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const pipelineColumns = pgTable("pipeline_columns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  orderIndex: integer("order_index").notNull(),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
