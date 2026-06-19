import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { NotificationBell } from "@/components/inbox/NotificationBell"
import { PresenceSwitcher } from "@/components/inbox/PresenceSwitcher"
import { UserMenu } from "@/components/auth/UserMenu"
import { useInboxRealtime } from "@/hooks/useInboxRealtime"

export function AppLayout() {
  useInboxRealtime()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        <header className="h-14 flex items-center justify-end px-4 border-b border-hairline flex-shrink-0 bg-canvas">
          <div className="flex items-center gap-2">
            <PresenceSwitcher />
            <NotificationBell />
            <UserMenu />
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
