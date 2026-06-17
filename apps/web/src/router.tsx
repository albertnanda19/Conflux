import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"
import { AppLayout } from "./components/layout/AppLayout"

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "inbox",
        element: (
          <Suspense fallback={<PageLoader />}>
            <InboxPage />
          </Suspense>
        ),
      },
      {
        path: "contacts",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactsPage />
          </Suspense>
        ),
      },
      {
        path: "contacts/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactProfilePage />
          </Suspense>
        ),
      },
      {
        path: "pipeline",
        element: (
          <Suspense fallback={<PageLoader />}>
            <PipelinePage />
          </Suspense>
        ),
      },
      {
        path: "labels",
        element: (
          <Suspense fallback={<PageLoader />}>
            <LabelsPage />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
      {
        path: "campaigns/new",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CreateCampaignPage />
          </Suspense>
        ),
      },
      {
        path: "campaigns/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CampaignDetailPage />
          </Suspense>
        ),
      },
      {
        path: "campaigns",
        element: (
          <Suspense fallback={<PageLoader />}>
            <CampaignsPage />
          </Suspense>
        ),
      },
      {
        path: "templates",
        element: (
          <Suspense fallback={<PageLoader />}>
            <TemplatesPage />
          </Suspense>
        ),
      },
      {
        path: "knowledge-base",
        element: (
          <Suspense fallback={<PageLoader />}>
            <KnowledgeBasePage />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
])
