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
const PipelinePage = lazy(() =>
  import("./pages/PipelinePage").then((m) => ({ default: m.PipelinePage })),
)
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
)
const LabelsPage = lazy(() =>
  import("./pages/LabelsPage").then((m) => ({ default: m.LabelsPage })),
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
        path: "campaigns",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactsPage />
          </Suspense>
        ),
      },
      {
        path: "templates",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactsPage />
          </Suspense>
        ),
      },
      {
        path: "knowledge-base",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactsPage />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ContactsPage />
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
