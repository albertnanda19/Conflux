import { NavLink } from "react-router-dom"
import { useSidebarStore } from "@/stores/ui"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/inbox", label: "Inbox", icon: "💬" },
  { to: "/contacts", label: "Kontak", icon: "👤" },
  { to: "/agents", label: "Kelola Agent", icon: "👥" },
  { to: "/pipeline", label: "Pipeline", icon: "📋" },
  { to: "/labels", label: "Label", icon: "🏷️" },
  { to: "/campaigns", label: "Campaign", icon: "📢" },
  { to: "/templates", label: "Template", icon: "📝" },
  { to: "/knowledge-base", label: "Knowledge Base", icon: "🧠" },
  { to: "/reports", label: "Laporan", icon: "📈" },
  { to: "/settings", label: "Pengaturan", icon: "⚙️" },
]

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200",
        isCollapsed ? "w-[68px]" : "w-[240px]",
      )}
    >
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        {!isCollapsed && (
          <span className="text-lg font-bold text-ink tracking-tight">Acme PSC</span>
        )}
        <button
          onClick={toggle}
          className="ml-auto w-8 h-8 flex items-center justify-center rounded-md text-steel hover:bg-sidebar-accent"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-charcoal hover:bg-sidebar-accent",
              )
            }
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
            A
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">Admin User</p>
              <p className="text-xs text-steel truncate">admin@test.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
