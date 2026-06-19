import { NavLink } from "react-router-dom"
import { useSidebarStore } from "@/stores/ui"
import { cn } from "@/lib/utils"

function NavIcon({ name }: { name: string }) {
  const props = { width: 20, height: 20, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
  switch (name) {
    case "dashboard":
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
    case "inbox":
      return <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    case "contacts":
      return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    case "agents":
      return <svg {...props}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    case "ai":
      return <svg {...props}><path d="M12 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z"/><circle cx="12" cy="12" r="1"/><path d="M12 13v4M8 17h8"/></svg>
    case "pipeline":
      return <svg {...props}><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
    case "labels":
      return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></svg>
    case "channels":
      return <svg {...props}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    case "campaigns":
      return <svg {...props}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
    case "templates":
      return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
    case "knowledge":
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
    case "reports":
      return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
    default:
      return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>
  }
}

const navItems = [
  { to: "/", label: "Dashboard", icon: "dashboard" },
  { to: "/inbox", label: "Inbox", icon: "inbox" },
  { to: "/contacts", label: "Kontak", icon: "contacts" },
  { to: "/agents", label: "Kelola Agent", icon: "agents" },
  { to: "/ai-assistants", label: "AI Assistant", icon: "ai" },
  { to: "/pipeline", label: "Pipeline", icon: "pipeline" },
  { to: "/labels", label: "Label", icon: "labels" },
  { to: "/channels", label: "Channel", icon: "channels" },
  { to: "/campaigns", label: "Campaign", icon: "campaigns" },
  { to: "/templates", label: "Template", icon: "templates" },
  { to: "/knowledge-base", label: "Knowledge Base", icon: "knowledge" },
  { to: "/reports", label: "Laporan", icon: "reports" },
  { to: "/settings", label: "Pengaturan", icon: "settings" },
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
            <span className="flex-shrink-0">
              <NavIcon name={item.icon} />
            </span>
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
