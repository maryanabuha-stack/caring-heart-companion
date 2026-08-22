import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import type { MedicationState } from "./MedicationCard";

export type MedicationDetail = {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  purpose: string;
  time: string;
  state: MedicationState;
  takenAt?: string | undefined;
};

export function MedicationDetailModal({
  med,
  open,
  onOpenChange,
  onMarkTaken,
  onUndo,
}: {
  med: MedicationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkTaken: () => void;
  onUndo: () => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  if (!med) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] rounded-2xl border-0 bg-card p-7 [&>button:last-of-type]:hidden">
        <button
          type="button"
          aria-label="Close"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-muted/70"
        >
          <X className="h-6 w-6" />
        </button>

        <DialogTitle className="pr-14 text-2xl font-semibold">{med.name}</DialogTitle>
        <DialogDescription className="text-lg text-muted-foreground">
          {med.dosage}
        </DialogDescription>

        <div className="mt-2 flex flex-col gap-4">
          <div className="rounded-2xl bg-row px-5 py-4">
            <p className="text-base font-medium text-muted-foreground">Schedule</p>
            <p className="mt-1 text-lg font-medium">{med.schedule}</p>
          </div>
          <div className="rounded-2xl bg-neutral-row px-5 py-4">
            <p className="text-base font-medium text-muted-foreground">What it&apos;s for</p>
            <p className="mt-1 text-lg font-medium">{med.purpose}</p>
          </div>
        </div>

        <div className="mt-4">
          {med.state === "taken" ? (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex min-h-[56px] w-full items-center justify-center rounded-lg bg-transparent text-lg font-medium text-primary underline-offset-4 hover:underline"
            >
              Undo
            </button>
          ) : (
            <button
              type="button"
              onClick={onMarkTaken}
              className="min-h-[56px] w-full rounded-2xl bg-primary text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {med.state === "missed" ? "Mark as taken now" : "Mark as taken"}
            </button>
          )}
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">
                Undo marking {med.name} as taken?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg">
                This will move {med.name} back to your medications to take today.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="min-h-[56px] rounded-2xl text-lg">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onUndo}
                className="min-h-[56px] rounded-2xl bg-primary text-lg text-primary-foreground"
              >
                Yes, undo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
