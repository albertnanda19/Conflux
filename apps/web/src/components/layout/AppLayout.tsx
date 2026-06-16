import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { NotificationBell } from "@/components/inbox/NotificationBell"

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <header className="h-14 flex items-center justify-end px-4 border-b border-hairline flex-shrink-0 bg-canvas">
          <NotificationBell />
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
