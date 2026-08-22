import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Pill,
  Heart,
  MessageSquare,
  BellRing,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Medications", url: "/medications", icon: Pill },
  { title: "Symptom Tracking", url: "/symptom-tracking", icon: Heart },
  { title: "Communication", url: "/communication", icon: MessageSquare },
  { title: "Reminders", url: "/reminders", icon: BellRing },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [collapsed, setCollapsed] = useState(false);

  // Restore the user's collapse choice so it survives navigation and reloads.
  useEffect(() => {
    if (localStorage.getItem("carenest.sidebar.collapsed") === "1") setCollapsed(true);
  }, []);

  const toggleCollapsed = () =>
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("carenest.sidebar.collapsed", next ? "1" : "0");
      return next;
    });

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar px-4 py-6 text-sidebar-foreground transition-[width] duration-200 ${
        collapsed ? "w-[104px]" : "w-[320px]"
      }`}
    >
      <div className={`flex items-center gap-3 pb-6 ${collapsed ? "flex-col justify-center" : "px-2"}`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          C
        </div>
        {!collapsed && <span className="text-2xl font-semibold">CareNest</span>}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand menu" : "Collapse menu"}
          title={collapsed ? "Expand menu" : "Collapse menu"}
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:bg-sidebar-active hover:text-sidebar-active-foreground ${
            collapsed ? "" : "ml-auto"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-6 w-6" />
          ) : (
            <PanelLeftClose className="h-6 w-6" />
          )}
        </button>
      </div>


      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              title={collapsed ? item.title : undefined}
              className={`flex min-h-[56px] items-center gap-4 rounded-lg border-l-4 px-4 text-left text-lg font-medium transition-colors ${
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
          className={`flex min-h-[56px] w-full items-center gap-4 rounded-lg px-4 text-left transition-colors hover:bg-sidebar-active/60 ${
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
