import { useState } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  takenAt?: string;
  nextReminderTime?: string;
  onMarkTaken?: () => void;
  onUndo?: () => void;
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
      <AlertTriangle className="h-7 w-7 text-warning" />
    ) : state === "taken" ? (
      <CheckCircle2 className="h-7 w-7 text-success" fill="currentColor" stroke="white" />
    ) : state === "due" ? (
      <Clock className="h-7 w-7 text-primary" fill="currentColor" stroke="white" />
    ) : (
      <Clock className="h-7 w-7 text-muted-foreground" />
    );

  const label =
    state === "missed" ? "Missed" : state === "taken" ? "Taken" : state === "due" ? "Next action" : "Next";

  return (
    <div
      className={`flex min-h-[88px] flex-wrap items-center gap-4 rounded-2xl ${surface[state]} px-5 py-4`}
    >
      <span className="shrink-0">{icon}</span>

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

      <div className="ml-auto">
        {(state === "due" || state === "missed") && (
          <button
            type="button"
            onClick={onMarkTaken}
            className="min-h-[56px] rounded-2xl bg-primary px-6 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
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
            Taken - Tap to undo
          </button>
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
