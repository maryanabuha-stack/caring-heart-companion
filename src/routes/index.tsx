import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Check,
  ChevronRight,
  Activity,
  MessageSquare,
} from "lucide-react";
import { MedicationCard } from "@/components/carenest/MedicationCard";
import { PageShell } from "@/components/carenest/PageShell";
import { useNow } from "@/hooks/use-now";
import { byPriority, medState, nowLabel } from "@/lib/med-time";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareNest Dashboard — Daily Medications & Care" },
      {
        name: "description",
        content:
          "CareNest dashboard for elderly patients and caregivers: today's medications, progress, daily tasks and quick access to symptom tracking.",
      },
      { property: "og:title", content: "CareNest Dashboard — Daily Medications & Care" },
      {
        property: "og:description",
        content:
          "Track medications, log symptoms and message your doctor from one calm, accessible dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

type Med = {
  id: string;
  name: string;
  time: string;
  takenAt?: string | undefined;
};

const initialMeds: Med[] = [
  { id: "1", name: "Lisinopril", time: "8:00 AM" },
  { id: "2", name: "Metformin", time: "12:30 PM" },
  { id: "3", name: "Vitamin D", time: "9:00 AM", takenAt: "9:05 AM" },
  { id: "4", name: "Atorvastatin", time: "6:00 PM" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [meds, setMeds] = useState<Med[]>(initialMeds);
  const [banner, setBanner] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [waterDoneAt, setWaterDoneAt] = useState<string | null>(null);
  const [walkDoneAt, setWalkDoneAt] = useState<string | null>(null);
  const now = useNow() ?? new Date(2000, 0, 1, 0, 0);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const announce = (message: string) => {
    setBanner(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBanner(null), 3500);
  };

  const markTaken = (med: Med) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, takenAt: nowLabel() } : m)),
    );
    announce(`${med.name} marked as taken`);
  };

  const undo = (med: Med) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === med.id ? { ...m, takenAt: undefined } : m)),
    );
    announce(`${med.name} moved back to today's medications`);
  };

  const rows = meds
    .map((m) => ({ ...m, state: medState(m.time, m.takenAt, now) }))
    .sort(byPriority);

  const taken = rows.filter((m) => m.state === "taken").length;
  const total = rows.length;
  const next = rows.find((m) => m.state === "due") ?? rows.find((m) => m.state === "missed");


  return (
    <PageShell>
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Good afternoon, Margaret</h1>
        <p className="mt-1 text-lg text-muted-foreground">
          Here is what matters today.
        </p>
      </header>

      <div aria-live="polite" className="min-h-0">
        {banner && (
          <div className="mb-6 flex min-h-[64px] items-center gap-3 rounded-2xl bg-tint px-5 py-4">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <p className="text-lg font-medium text-tint-foreground">{banner}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {next && (
          <section className="rounded-2xl bg-tint px-6 py-5">
            <p className="text-base font-medium text-tint-foreground">Next action</p>
            <p className="mt-1 text-2xl font-semibold">
              Take {next.name} at {next.time}
            </p>
          </section>
        )}

        <section className="rounded-2xl bg-card px-6 py-5">
          <h2 className="text-2xl font-semibold">Today&apos;s progress</h2>
          <p className="mt-2 text-lg">
            {taken} of {total} medications taken today
          </p>
          <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(taken / total) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-base text-muted-foreground">Keep it up</p>
        </section>

        <section className="rounded-2xl bg-card px-6 py-5">
          <h2 className="text-2xl font-semibold">Medications today</h2>
          <div className="mt-4 flex flex-col gap-3">
            {[...meds].sort(byPriority).map((med) => (
              <MedicationCard
                key={med.id}
                state={med.state}
                name={med.name}
                time={med.time}
                takenAt={med.takenAt}
                onMarkTaken={() => markTaken(med)}
                onUndo={() => undo(med)}
              />
            ))}
          </div>
        </section>

        <section className="mt-3 rounded-2xl bg-card px-6 py-5">
          <h2 className="text-2xl font-semibold">Daily tasks</h2>
          <div className="mt-4 flex flex-col gap-3">
            <TaskRow
              label="Drink a glass of water"
              completedAt={waterDoneAt}
              onToggle={() => setWaterDoneAt((v) => (v ? null : nowLabel()))}
            />
            <TaskRow
              label="Take a short walk"
              completedAt={walkDoneAt}
              onToggle={() => setWalkDoneAt((v) => (v ? null : nowLabel()))}
            />
            <button
              type="button"
              onClick={() => navigate({ to: "/symptom-tracking" })}
              className="flex min-h-[56px] w-full items-center gap-4 rounded-2xl bg-row px-5 py-3 text-left"
            >
              <span className="flex-1 text-lg font-medium">Log how you&apos;re feeling today</span>
              <span className="text-base text-muted-foreground">Open Symptom Tracking</span>
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </div>
        </section>

        <section className="mt-3">
          <h2 className="mb-4 text-2xl font-semibold">Quick access</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickTile
              icon={<Activity className="h-10 w-10 text-primary" />}
              label="How I'm feeling"
              onClick={() => navigate({ to: "/symptom-tracking" })}
            />
            <QuickTile
              icon={<MessageSquare className="h-10 w-10 text-primary" />}
              label="Message my doctor"
              onClick={() => navigate({ to: "/communication" })}
            />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function TaskRow({
  label,
  completedAt,
  onToggle,
}: {
  label: string;
  completedAt: string | null;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={!!completedAt}
      onClick={onToggle}
      className="flex min-h-[56px] w-full items-center gap-4 rounded-2xl bg-row px-5 py-3 text-left"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 ${
          completedAt ? "border-primary bg-primary" : "border-muted-foreground/50 bg-card"
        }`}
      >
        {completedAt && <Check className="h-5 w-5 text-primary-foreground" />}
      </span>
      <span className="flex flex-col">
        <span className={`text-lg font-medium ${completedAt ? "line-through" : ""}`}>{label}</span>
        {completedAt && (
          <span className="text-base text-muted-foreground">Completed at {completedAt}</span>
        )}
      </span>
    </button>
  );
}

function QuickTile({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex aspect-[2/1] min-h-[140px] flex-col items-center justify-center gap-3 rounded-2xl bg-card px-4 text-center"
    >
      {icon}
      <span className="text-xl font-semibold">{label}</span>
    </button>
  );
}
