import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/carenest/PageShell";
import { MedicationCard } from "@/components/carenest/MedicationCard";

export const Route = createFileRoute("/medications")({
  head: () => ({
    meta: [
      { title: "Medications — CareNest" },
      { name: "description", content: "All of today's CareNest medications with clear status and one-tap mark as taken." },
      { property: "og:title", content: "Medications — CareNest" },
      { property: "og:description", content: "All of today's CareNest medications with clear status and one-tap mark as taken." },
    ],
  }),
  component: Medications,
});

type Med = { id: string; name: string; time: string; state: "upcoming" | "due" | "missed" | "taken"; takenAt?: string | undefined };

function Medications() {
  const [meds, setMeds] = useState<Med[]>([
    { id: "1", name: "Lisinopril", time: "8:00 AM", state: "due" },
    { id: "2", name: "Metformin", time: "12:30 PM", state: "missed" },
    { id: "3", name: "Vitamin D", time: "9:00 AM", state: "taken", takenAt: "9:05 AM" },
    { id: "4", name: "Atorvastatin", time: "6:00 PM", state: "upcoming" },
  ]);
  const [banner, setBanner] = useState<string | null>(null);

  const announce = (m: string) => {
    setBanner(m);
    setTimeout(() => setBanner(null), 3500);
  };

  return (
    <PageShell>
      <h1 className="mb-6 text-3xl font-semibold">Medications</h1>
      <div aria-live="polite">
        {banner && (
          <div className="mb-6 flex min-h-[64px] items-center gap-3 rounded-2xl bg-tint px-5 py-4">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <p className="text-lg font-medium text-tint-foreground">{banner}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3 rounded-2xl bg-card p-5">
        {meds.map((med) => (
          <MedicationCard
            key={med.id}
            state={med.state}
            name={med.name}
            time={med.time}
            takenAt={med.takenAt}
            onMarkTaken={() => {
              setMeds((p) =>
                p.map((m) =>
                  m.id === med.id
                    ? { ...m, state: "taken", takenAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }
                    : m,
                ),
              );
              announce(`${med.name} marked as taken`);
            }}
            onUndo={() => {
              setMeds((p) => p.map((m) => (m.id === med.id ? { ...m, state: "due", takenAt: undefined } : m)));
              announce(`${med.name} moved back to today's medications`);
            }}
          />
        ))}
      </div>
    </PageShell>
  );
}
