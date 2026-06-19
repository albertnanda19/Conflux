import { Elysia } from "elysia"
import { authRoutes } from "@/modules/auth/routes"
import { contactsRoutes } from "@/modules/contacts/routes"
import { conversationsRoutes } from "@/modules/conversations/routes"
import { channelsRoutes } from "@/modules/channels/routes"
import { messagesRoutes } from "@/modules/messages/routes"
import { knowledgeBaseRoutes } from "@/modules/knowledge-base/routes"
import { aiAssistantRoutes } from "@/modules/ai-assistant/routes"
import { pipelineRoutes } from "@/modules/pipeline/routes"
import { broadcastRoutes } from "@/modules/broadcast/routes"
import { analyticsRoutes } from "@/modules/analytics/routes"
import { notificationsRoutes } from "@/modules/notifications/routes"
import { usersRoutes } from "@/modules/users/routes"
import { reportsRoutes } from "@/modules/reports/routes"
import { searchRoutes } from "@/modules/search/routes"
import { settingsRoutes } from "@/modules/settings/routes"
import { labelsRoutes } from "@/modules/labels/routes"
import { quickRepliesRoutes } from "@/modules/quick-replies/routes"
import { mediaRoutes } from "@/modules/media/routes"

export const apiRoutes = new Elysia({ prefix: "/api/v1" })
  .use(authRoutes)
  .use(contactsRoutes)
  .use(conversationsRoutes)
  .use(channelsRoutes)
  .use(messagesRoutes)
  .use(knowledgeBaseRoutes)
  .use(aiAssistantRoutes)
  .use(pipelineRoutes)
  .use(broadcastRoutes)
  .use(analyticsRoutes)
  .use(notificationsRoutes)
  .use(usersRoutes)
  .use(reportsRoutes)
  .use(searchRoutes)
  .use(settingsRoutes)
  .use(labelsRoutes)
  .use(quickRepliesRoutes)
  .use(mediaRoutes)
