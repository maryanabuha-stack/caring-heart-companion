import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Pill,
  Activity,
  MessageSquare,
  BellRing,
  Settings,
  Phone,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppSettings } from "@/hooks/use-app-settings";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Medications", url: "/medications", icon: Pill },
  { title: "Symptom Tracking", url: "/symptom-tracking", icon: Activity },
  { title: "Communication", url: "/communication", icon: MessageSquare },
  { title: "Reminders", url: "/reminders", icon: BellRing },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [confirmEmergency, setConfirmEmergency] = useState(false);
  // Applies the saved text-size / contrast preferences on every screen.
  useAppSettings();

  return (
    <aside className="sticky top-0 flex h-screen w-[320px] shrink-0 flex-col overflow-y-auto bg-navy px-5 py-6 text-navy-foreground">
      <div className="flex items-center gap-3 px-2 pb-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          C
        </div>
        <span className="text-2xl font-semibold">CareNest</span>
      </div>

      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex min-h-[56px] items-center gap-4 rounded-2xl px-5 text-left text-lg font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-navy-foreground/85 hover:bg-primary/15"
              }`}
            >
              <item.icon className="h-6 w-6 shrink-0" />
              <span className="whitespace-nowrap">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setConfirmEmergency(true)}
          className="flex min-h-[56px] w-full items-center gap-4 rounded-2xl px-5 text-left text-lg font-semibold text-emergency transition-colors hover:bg-primary/15"
        >
          <Phone className="h-6 w-6 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Emergency: Call 911</span>
        </button>

        <Link
          to="/settings"
          className="flex min-h-[56px] w-full items-center gap-4 rounded-2xl px-5 text-left transition-colors hover:bg-primary/15"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/25 text-base font-semibold">
            MR
          </span>
          <span className="flex flex-col">
            <span className="text-lg font-medium">Margaret Reyes</span>
            <span className="flex items-center gap-1 text-base text-navy-muted">
              <Settings className="h-4 w-4" /> Settings
            </span>
          </span>
        </Link>
      </div>

      <AlertDialog open={confirmEmergency} onOpenChange={setConfirmEmergency}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Call emergency services now?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              This will open your phone app and start a call to 911.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="min-h-[56px] rounded-2xl px-8 text-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              asChild
              className="min-h-[56px] rounded-2xl bg-primary px-8 text-lg text-primary-foreground"
            >
              <a href="tel:911">Yes, call</a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
