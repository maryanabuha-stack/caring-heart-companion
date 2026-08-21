import { useState } from "react";
import { Clock, AlertTriangle, CheckCircle2, Check, ChevronRight } from "lucide-react";
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

export type MedicationState = "upcoming" | "due" | "missed" | "taken" | "empty";

export type MedicationCardProps = {
  state: MedicationState;
  name?: string;
  time?: string;
  takenAt?: string | undefined;
  nextReminderTime?: string | undefined;
  onMarkTaken?: () => void;
  onUndo?: () => void;
  onOpenDetail?: () => void;
};

const surface: Record<MedicationState, string> = {
  upcoming: "bg-neutral-row",
  due: "bg-row",
  missed: "bg-warning-surface",
  taken: "bg-row",
  empty: "bg-row",
};

export function MedicationCard({
  state,
  name = "",
  time = "",
  takenAt,
  nextReminderTime,
  onMarkTaken,
  onUndo,
  onOpenDetail,
}: MedicationCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (state === "empty") {
    return (
      <div className={`flex flex-col items-center gap-3 rounded-2xl ${surface.empty} px-6 py-10 text-center`}>
        <CheckCircle2 className="h-14 w-14 text-success" />
        <p className="text-2xl font-semibold">All done for today</p>
        <p className="text-lg text-muted-foreground">
          Next reminder tomorrow at {nextReminderTime ?? "8:00 AM"}
        </p>
      </div>
    );
  }

  const icon =
    state === "missed" ? (
      <span className="relative flex h-7 w-7 items-center justify-center">
        <AlertTriangle
          className="h-7 w-7 text-warning"
          strokeWidth={2}
          fill="currentColor"
          stroke="currentColor"
        />
        <AlertTriangle
          aria-hidden="true"
          className="absolute inset-0 h-7 w-7 text-card [&>path:first-of-type]:hidden"
          strokeWidth={2.5}
          fill="none"
          stroke="currentColor"
        />

      </span>
    ) : state === "taken" ? (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success">
        <Check className="h-5 w-5 text-card" strokeWidth={3} />
      </span>
    ) : state === "due" ? (
      <AlarmClock className="h-7 w-7 text-primary" strokeWidth={2} />
    ) : (
      <Clock className="h-7 w-7 text-muted-foreground" strokeWidth={2} />
    );

  const label =
    state === "missed" ? "Missed" : state === "taken" ? "Taken" : state === "due" ? "Next action" : "Next";

  const interactive = Boolean(onOpenDetail);

  return (
    <div
      {...(interactive
        ? {
            role: "button" as const,
            tabIndex: 0,
            "aria-label": `Open details for ${name}`,
            onClick: onOpenDetail,
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpenDetail?.();
              }
            },
          }
        : {})}
      className={`flex min-h-[88px] flex-wrap items-center gap-4 rounded-2xl ${surface[state]} px-5 py-4 transition-colors duration-300 ease-out ${
        interactive ? "cursor-pointer text-left hover:brightness-[0.98]" : ""
      }`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center">{icon}</span>


      <div className="min-w-[180px] flex-1">
        <p
          className={`text-base font-medium ${
            state === "missed" ? "text-warning-foreground" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-lg text-muted-foreground">
          {state === "taken" ? `Taken at ${takenAt ?? time}` : time}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div onClick={(e) => e.stopPropagation()}>
          {(state === "due" || state === "missed") && (
            <button
              type="button"
              onClick={onMarkTaken}
              className={`min-h-[56px] rounded-2xl px-6 text-lg font-semibold transition-opacity hover:opacity-90 ${
                state === "missed"
                  ? "bg-warning-strong text-warning-strong-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {state === "missed" ? "Mark as taken now" : "Mark as taken"}
            </button>
          )}

          {state === "taken" && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex min-h-[56px] items-center px-2 text-lg font-medium text-primary underline-offset-4 hover:underline"
            >
              Undo
            </button>
          )}
        </div>

        {interactive && (
          <ChevronRight
            aria-hidden="true"
            strokeWidth={2}
            className={`h-6 w-6 shrink-0 ${
              state === "missed" ? "text-warning-foreground/60" : "text-muted-foreground"
            }`}
          />
        )}
      </div>


      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Undo marking {name} as taken?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              This will move {name} back to your medications to take today.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-[56px] rounded-2xl text-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onUndo?.()}
              className="min-h-[56px] rounded-2xl bg-primary text-lg text-primary-foreground"
            >
              Yes, undo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
