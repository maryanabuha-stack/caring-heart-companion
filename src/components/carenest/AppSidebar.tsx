import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Pill,
  Activity,
  MessageSquare,
  BellRing,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Medications", url: "/medications", icon: Pill },
  { title: "Symptom Tracking", url: "/symptom-tracking", icon: Activity },
  { title: "Communication", url: "/communication", icon: MessageSquare },
  { title: "Reminders", url: "/reminders", icon: BellRing },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground transition-[width] duration-200 ${
        collapsed ? "w-[104px]" : "w-[320px]"
      }`}
    >
      <div className={`flex items-center gap-3 pb-4 ${collapsed ? "justify-center" : "px-2"}`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          C
        </div>
        {!collapsed && <span className="text-2xl font-semibold">CareNest</span>}
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
        className={`mb-4 flex min-h-[56px] items-center gap-3 rounded-2xl border-2 border-sidebar-border px-4 text-lg font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-active ${
          collapsed ? "justify-center" : ""
        }`}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-6 w-6 shrink-0" />
        ) : (
          <>
            <PanelLeftClose className="h-6 w-6 shrink-0" />
            <span className="whitespace-nowrap">Collapse menu</span>
          </>
        )}
      </button>

      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              title={collapsed ? item.title : undefined}
              className={`flex min-h-[56px] items-center gap-4 rounded-2xl border-l-4 px-4 text-left text-lg font-medium transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "border-primary bg-sidebar-active text-sidebar-active-foreground"
                  : "border-transparent text-sidebar-foreground hover:bg-sidebar-active/60"
              }`}
            >
              <item.icon className="h-6 w-6 shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          className={`flex min-h-[56px] w-full items-center gap-4 rounded-2xl px-4 text-left transition-colors hover:bg-sidebar-active/60 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-active text-base font-semibold text-sidebar-active-foreground">
            MR
          </span>
          {!collapsed && (
            <span className="flex flex-col">
              <span className="text-lg font-medium">Margaret Reyes</span>
              <span className="flex items-center gap-1 text-base text-sidebar-muted">
                <Settings className="h-4 w-4" /> Settings
              </span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
