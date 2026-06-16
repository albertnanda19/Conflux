import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
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
  credentials: jsonb("credentials"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

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
  status: varchar("status", { length: 20 }).default("open").notNull(),
  isAiHandling: boolean("is_ai_handling").default(false).notNull(),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("conversations_contact_idx").on(table.contactId),
  index("conversations_agent_idx").on(table.agentId),
  index("conversations_status_idx").on(table.status),
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

export const kbDocuments = pgTable("kb_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  content: text("content"),
  embedding: text("embedding"),
  isActive: boolean("is_active").default(true).notNull(),
  originalFileUrl: text("original_file_url"),
  fileType: varchar("file_type", { length: 50 }),
  chunkIndex: integer("chunk_index"),
  sourceDocumentId: uuid("source_document_id"),
  processingStatus: varchar("processing_status", { length: 20 }).default("pending").notNull(),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("kb_category_idx").on(table.category),
  index("kb_processing_idx").on(table.processingStatus),
  index("kb_source_idx").on(table.sourceDocumentId),
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
