import { useState } from "react";
import { Clock, AlarmClock, AlertTriangle, CheckCircle2, Check, ChevronRight } from "lucide-react";
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
  /** "primary" renders the single filled call-to-action; everything else is outline. */
  emphasis?: "primary" | "secondary";
  onMarkTaken?: () => void;
  onUndo?: () => void;
  onOpenDetail?: () => void;
  className?: string;
};

/** Soft tinted circle behind the status icon. */
const iconSurface: Record<Exclude<MedicationState, "empty">, string> = {
  upcoming: "bg-icon-neutral",
  due: "bg-icon-due",
  missed: "bg-icon-missed",
  taken: "bg-icon-taken",
};

const statusLabel: Record<Exclude<MedicationState, "empty">, string> = {
  upcoming: "Upcoming",
  due: "Due now",
  missed: "Missed",
  taken: "Taken",
};

const statusText: Record<Exclude<MedicationState, "empty">, string> = {
  upcoming: "text-muted-foreground",
  due: "text-primary-strong",
  missed: "text-warning-foreground",
  taken: "text-success",
};

export function MedicationCard({
  state,
  name = "",
  time = "",
  takenAt,
  nextReminderTime,
  emphasis = "secondary",
  onMarkTaken,
  onUndo,
  onOpenDetail,
  className = "",
}: MedicationCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (state === "empty") {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
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
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          d="M12 3.2 22 20.4H2L12 3.2Z"
          fill="var(--warning-strong)"
          stroke="var(--warning-strong)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 9.6v4.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="17.3" r="1.15" fill="#fff" />
      </svg>
    ) : state === "taken" ? (
      <Check className="h-6 w-6 text-success" strokeWidth={3} />
    ) : state === "due" ? (
      <AlarmClock className="h-6 w-6 text-primary-strong" strokeWidth={2} />
    ) : (
      <Clock className="h-6 w-6 text-muted-foreground" strokeWidth={2} />
    );


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
      className={`flex min-h-[88px] flex-wrap items-center gap-4 bg-card px-2 py-4 transition-colors duration-200 ease-out ${
        interactive ? "cursor-pointer text-left hover:bg-muted/50" : ""
      } ${className}`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconSurface[state]}`}
      >
        {icon}
      </span>

      <div className="min-w-[180px] flex-1">
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-lg text-muted-foreground">
          {state === "taken" ? `Taken at ${takenAt ?? time}` : time}
          <span aria-hidden="true"> • </span>
          <span className={`font-medium ${statusText[state]}`}>{statusLabel[state]}</span>
        </p>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div onClick={(e) => e.stopPropagation()}>
          {(state === "due" || state === "missed" || state === "upcoming") && (
            <button
              type="button"
              onClick={onMarkTaken}
              className={`min-h-[56px] rounded-2xl px-6 text-lg font-semibold transition-colors ${
                emphasis === "primary"
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : state === "missed"
                    ? "border-2 border-warning-border bg-transparent text-warning-foreground hover:bg-icon-missed"
                    : "border-2 border-primary-border bg-transparent text-primary-strong hover:bg-icon-due"
              }`}
            >
              {state === "missed" ? "Mark as taken now" : "Mark as taken"}
            </button>
          )}

          {state === "taken" && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex min-h-[56px] items-center px-2 text-lg font-medium text-primary-strong underline-offset-4 hover:underline"
            >
              Undo
            </button>
          )}
        </div>

        {interactive && (
          <ChevronRight
            aria-hidden="true"
            strokeWidth={2}
            className="h-6 w-6 shrink-0 text-muted-foreground"
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
