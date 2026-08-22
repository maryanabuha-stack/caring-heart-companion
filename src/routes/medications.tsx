import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Sun, CloudSun, Moon } from "lucide-react";
import { PageShell } from "@/components/carenest/PageShell";
import { ConfirmationBanner } from "@/components/carenest/ConfirmationBanner";
import { MedicationCard } from "@/components/carenest/MedicationCard";
import { MedicationDetailModal } from "@/components/carenest/MedicationDetailModal";
import { useNow } from "@/hooks/use-now";
import { byPriority, medState, nowLabel } from "@/lib/med-time";
import type { MedicationDetail } from "@/components/carenest/MedicationDetailModal";

export const Route = createFileRoute("/medications")({
  head: () => ({
    meta: [
      { title: "Medications — CareNest" },
      {
        name: "description",
        content:
          "The full CareNest medication schedule grouped by morning, afternoon and evening, with clear status and one-tap mark as taken.",
      },
      { property: "og:title", content: "Medications — CareNest" },
      {
        property: "og:description",
        content:
          "See every medication grouped by time of day, open plain-language details, and mark doses as taken.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Medications,
});

type Group = "Morning" | "Afternoon" | "Evening";
type Med = Omit<MedicationDetail, "state"> & { group: Group };

const initialMeds: Med[] = [
  {
    id: "1",
    group: "Morning",
    name: "Lisinopril",
    dosage: "10mg · 1 tablet",
    schedule: "Once a day, in the morning · 8:00 AM",
    purpose: "Helps keep your blood pressure at a healthy level.",
    time: "8:00 AM",
  },
  {
    id: "2",
    group: "Morning",
    name: "Vitamin D",
    dosage: "1000 IU · 1 capsule",
    schedule: "Once a day, with breakfast · 9:00 AM",
    purpose: "Supports strong bones and general wellbeing.",
    time: "9:00 AM",
    takenAt: "9:05 AM",
  },
  {
    id: "3",
    group: "Afternoon",
    name: "Metformin",
    dosage: "500mg · 1 tablet",
    schedule: "Twice a day, with food · 12:30 PM",
    purpose: "Helps control blood sugar levels.",
    time: "12:30 PM",
  },
  {
    id: "4",
    group: "Afternoon",
    name: "Aspirin",
    dosage: "81mg · 1 tablet",
    schedule: "Once a day, after lunch · 2:00 PM",
    purpose: "Helps protect your heart.",
    time: "2:00 PM",
  },
  {
    id: "5",
    group: "Evening",
    name: "Atorvastatin",
    dosage: "20mg · 1 tablet",
    schedule: "Once a day, in the evening · 6:00 PM",
    purpose: "Helps keep your cholesterol under control.",
    time: "6:00 PM",
  },
  {
    id: "6",
    group: "Evening",
    name: "Melatonin",
    dosage: "3mg · 1 tablet",
    schedule: "Once a day, before bed · 9:00 PM",
    purpose: "Helps you fall asleep more easily.",
    time: "9:00 PM",
  },
];

const groups: Group[] = ["Morning", "Afternoon", "Evening"];

const groupIcon: Record<Group, typeof Sun> = {
  Morning: Sun,
  Afternoon: CloudSun,
  Evening: Moon,
};

function Medications() {
  const [meds, setMeds] = useState<Med[]>(initialMeds);
  const [banner, setBanner] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = useNow() ?? new Date(2000, 0, 1, 0, 0);
  const withState = meds.map((m) => ({ ...m, state: medState(m.time, m.takenAt, now) }));

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

  const primaryId = (withState.slice().sort(byPriority).find((m) => m.state === "due") ??
    withState.slice().sort(byPriority).find((m) => m.state === "missed"))?.id;

  const allTaken = withState.every((m) => m.state === "taken");
  const openMed = withState.find((m) => m.id === openId) ?? null;

  return (
    <PageShell>
      <h1 className="text-3xl font-medium">Medications</h1>
      <p className="mb-6 mt-2 text-[15px] text-muted-foreground">
        See your medications for today and mark them as taken. Tap any medication for more details.
      </p>

      <ConfirmationBanner message={banner} />

      {allTaken && (
        <div className="mb-6 flex min-h-[64px] items-center gap-3 rounded-2xl bg-card px-5 py-4">
          <CheckCircle2 className="h-7 w-7 text-success" />
          <p className="text-xl font-semibold">All medications taken for today</p>
        </div>
      )}

      <div className="flex flex-col gap-12">
        {groups.map((group) => {
          const rows = withState.filter((m) => m.group === group).sort(byPriority);
          if (rows.length === 0) return null;
          const GroupIcon = groupIcon[group];
          return (
            <section key={group}>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                <GroupIcon aria-hidden="true" strokeWidth={2} className="h-7 w-7 text-muted-foreground" />
                {group}
              </h2>
              <div className="flex flex-col divide-y divide-divider">
                {rows.map((med) => (
                  <MedicationCard
                    key={med.id}
                    emphasis={med.id === primaryId ? "primary" : "secondary"}
                    state={med.state}
                    name={med.name}
                    time={med.time}
                    takenAt={med.takenAt}
                    onMarkTaken={() => markTaken(med)}
                    onUndo={() => undo(med)}
                    onOpenDetail={() => setOpenId(med.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <MedicationDetailModal
        med={openMed}
        open={openMed !== null}
        onOpenChange={(o) => !o && setOpenId(null)}
        onMarkTaken={() => {
          if (openMed) markTaken(openMed as Med);
          setOpenId(null);
        }}
        onUndo={() => {
          if (openMed) undo(openMed as Med);
          setOpenId(null);
        }}
      />
    </PageShell>
  );
}
