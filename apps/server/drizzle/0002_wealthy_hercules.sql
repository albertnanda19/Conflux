CREATE EXTENSION IF NOT EXISTS vector;--> statement-breakpoint
CREATE TABLE "ai_assistants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"avatar" varchar(50),
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"persona_name" varchar(255),
	"persona_language" varchar(100),
	"persona_tone" varchar(20) DEFAULT 'semi-formal' NOT NULL,
	"system_prompt" text,
	"working_hours" jsonb,
	"handoff_config" jsonb,
	"kb_scope" varchar(20) DEFAULT 'global' NOT NULL,
	"custom_kb_document_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"assigned_agent_id" uuid,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"priority" integer NOT NULL,
	"max_tokens" integer DEFAULT 1024 NOT NULL,
	"temperature" real DEFAULT 0.7 NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"env_key_name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ai_enabled" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "kb_documents" DROP COLUMN "embedding";--> statement-breakpoint
ALTER TABLE "kb_documents" ADD COLUMN "embedding" vector(768);--> statement-breakpoint
ALTER TABLE "kb_documents" ADD COLUMN "ai_assistant_id" uuid;--> statement-breakpoint
ALTER TABLE "kb_documents" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "kb_documents" ADD COLUMN "chunk_count" integer;--> statement-breakpoint
ALTER TABLE "kb_documents" ADD COLUMN "created_by_name" varchar(255);--> statement-breakpoint
ALTER TABLE "ai_assistants" ADD CONSTRAINT "ai_assistants_assigned_agent_id_users_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_assistants_status_idx" ON "ai_assistants" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "ai_assistants_assigned_agent_idx" ON "ai_assistants" USING btree ("assigned_agent_id");--> statement-breakpoint
CREATE INDEX "ai_providers_priority_idx" ON "ai_providers" USING btree ("priority");--> statement-breakpoint
ALTER TABLE "kb_documents" ADD CONSTRAINT "kb_documents_ai_assistant_id_ai_assistants_id_fk" FOREIGN KEY ("ai_assistant_id") REFERENCES "public"."ai_assistants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kb_assistant_idx" ON "kb_documents" USING btree ("ai_assistant_id");--> statement-breakpoint
CREATE INDEX "kb_embedding_idx" ON "kb_documents" USING hnsw ("embedding" vector_cosine_ops);