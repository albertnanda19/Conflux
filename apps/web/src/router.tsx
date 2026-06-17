import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AppLayout } from "./components/layout/AppLayout"
import { RequireAuth } from "./components/auth/RequireAuth"

const LoginPage = lazy(() =>
  import("./pages/LoginPage").then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
)
const InboxPage = lazy(() =>
  import("./pages/InboxPage").then((m) => ({ default: m.InboxPage })),
)
const ContactsPage = lazy(() =>
  import("./pages/ContactsPage").then((m) => ({ default: m.ContactsPage })),
)
const ContactProfilePage = lazy(() =>
  import("./pages/ContactProfilePage").then((m) => ({ default: m.ContactProfilePage })),
)
const PipelinePage = lazy(() =>
  import("./pages/PipelinePage").then((m) => ({ default: m.PipelinePage })),
)
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
)
const LabelsPage = lazy(() =>
  import("./pages/LabelsPage").then((m) => ({ default: m.LabelsPage })),
)
const CampaignsPage = lazy(() =>
  import("./pages/CampaignsPage").then((m) => ({ default: m.CampaignsPage })),
)
const CampaignDetailPage = lazy(() =>
  import("./pages/CampaignDetailPage").then((m) => ({ default: m.CampaignDetailPage })),
)
const CreateCampaignPage = lazy(() =>
  import("./pages/CreateCampaignPage").then((m) => ({ default: m.CreateCampaignPage })),
)
const TemplatesPage = lazy(() =>
  import("./pages/TemplatesPage").then((m) => ({ default: m.TemplatesPage })),
)
const KnowledgeBasePage = lazy(() =>
  import("./pages/KnowledgeBasePage").then((m) => ({ default: m.KnowledgeBasePage })),
)
const ReportsPage = lazy(() =>
  import("./pages/ReportsPage").then((m) => ({ default: m.ReportsPage })),
)
const AgentsPage = lazy(() =>
  import("./pages/AgentsPage").then((m) => ({ default: m.AgentsPage })),
)
const AgentProfilePage = lazy(() =>
  import("./pages/AgentProfilePage").then((m) => ({ default: m.AgentProfilePage })),
)
const AIAssistantsPage = lazy(() =>
  import("./pages/AIAssistantsPage").then((m) => ({ default: m.AIAssistantsPage })),
)
const AIAssistantDetailPage = lazy(() =>
  import("./pages/AIAssistantDetailPage").then((m) => ({ default: m.AIAssistantDetailPage })),
)
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function SuspenseWrap({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <SuspenseWrap>
        <LoginPage />
      </SuspenseWrap>
    ),
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <SuspenseWrap><DashboardPage /></SuspenseWrap>,
          },
          {
            path: "inbox",
            element: <SuspenseWrap><InboxPage /></SuspenseWrap>,
          },
          {
            path: "contacts",
            element: <SuspenseWrap><ContactsPage /></SuspenseWrap>,
          },
          {
            path: "contacts/:id",
            element: <SuspenseWrap><ContactProfilePage /></SuspenseWrap>,
          },
          {
            path: "pipeline",
            element: <SuspenseWrap><PipelinePage /></SuspenseWrap>,
          },
          {
            path: "labels",
            element: <SuspenseWrap><LabelsPage /></SuspenseWrap>,
          },
          {
            path: "settings",
            element: <SuspenseWrap><SettingsPage /></SuspenseWrap>,
          },
          {
            path: "campaigns/new",
            element: <SuspenseWrap><CreateCampaignPage /></SuspenseWrap>,
          },
          {
            path: "campaigns/:id",
            element: <SuspenseWrap><CampaignDetailPage /></SuspenseWrap>,
          },
          {
            path: "campaigns",
            element: <SuspenseWrap><CampaignsPage /></SuspenseWrap>,
          },
          {
            path: "templates",
            element: <SuspenseWrap><TemplatesPage /></SuspenseWrap>,
          },
          {
            path: "knowledge-base",
            element: <SuspenseWrap><KnowledgeBasePage /></SuspenseWrap>,
          },
          {
            path: "reports",
            element: <SuspenseWrap><ReportsPage /></SuspenseWrap>,
          },
          {
            path: "agents/new",
            element: <SuspenseWrap><AgentsPage /></SuspenseWrap>,
          },
          {
            path: "agents/:id",
            element: <SuspenseWrap><AgentProfilePage /></SuspenseWrap>,
          },
          {
            path: "agents",
            element: <SuspenseWrap><AgentsPage /></SuspenseWrap>,
          },
          {
            path: "ai-assistants",
            element: <SuspenseWrap><AIAssistantsPage /></SuspenseWrap>,
          },
          {
            path: "ai-assistants/:id",
            element: <SuspenseWrap><AIAssistantDetailPage /></SuspenseWrap>,
          },
          {
            path: "*",
            element: <SuspenseWrap><NotFoundPage /></SuspenseWrap>,
          },
        ],
      },
    ],
  },
])
