import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/carenest/PageShell";
import { ConfirmationBanner } from "@/components/carenest/ConfirmationBanner";
import { MedicationCard } from "@/components/carenest/MedicationCard";
import { useNow } from "@/hooks/use-now";
import { Sun, CloudSun, Moon, Check, Pill, GlassWater, Footprints, ChevronDown, type LucideIcon } from "lucide-react";
import { byPriority, medState, nowLabel, type MedTimeState } from "@/lib/med-time";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Today's Reminders — CareNest" },
      {
        name: "description",
        content:
          "Every CareNest reminder for today in one chronological list: medications and daily tasks, with tomorrow's schedule below.",
      },
      { property: "og:title", content: "Today's Reminders — CareNest" },
      {
        property: "og:description",
        content:
          "Medications and daily tasks for today in one calm list, plus a preview of tomorrow's schedule.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reminders,
});

type Reminder = {
  id: string;
  name: string;
  time: string;
  kind: "medication" | "task";
  doneAt?: string | undefined;
};

const initialReminders: Reminder[] = [
  { id: "m1", name: "Lisinopril", time: "8:00 AM", kind: "medication" },
  { id: "t1", name: "Drink a glass of water", time: "9:30 AM", kind: "task" },
  { id: "m2", name: "Vitamin D", time: "9:00 AM", kind: "medication", doneAt: "9:05 AM" },
  { id: "m3", name: "Metformin", time: "12:30 PM", kind: "medication" },
  { id: "t2", name: "Take a short walk", time: "3:00 PM", kind: "task" },
  { id: "m4", name: "Atorvastatin", time: "6:00 PM", kind: "medication" },
  { id: "m5", name: "Melatonin", time: "9:00 PM", kind: "medication" },
];

const sections: {
  label: string;
  states: string[];
}[] = [
  { label: "Needs attention", states: ["missed", "due"] },
  { label: "Later today", states: ["upcoming"] },
  { label: "Completed", states: ["taken"] },
];

type TomorrowGroup = { label: string; icon: LucideIcon; items: { name: string; time: string }[] };

const tomorrowGroups: TomorrowGroup[] = [
  {
    label: "Morning",
    icon: Sun,
    items: [
      { name: "Lisinopril", time: "8:00 AM" },
      { name: "Vitamin D", time: "9:00 AM" },
      { name: "Drink a glass of water", time: "9:30 AM" },
    ],
  },
  {
    label: "Afternoon",
    icon: CloudSun,
    items: [
      { name: "Metformin", time: "12:30 PM" },
      { name: "Aspirin", time: "2:00 PM" },
      { name: "Take a short walk", time: "3:00 PM" },
    ],
  },
  {
    label: "Evening",
    icon: Moon,
    items: [
      { name: "Atorvastatin", time: "6:00 PM" },
      { name: "Melatonin", time: "9:00 PM" },
    ],
  },
];

const tomorrow = tomorrowGroups.flatMap((g) => g.items);

function tomorrowItemIcon(name: string) {
  if (name === "Drink a glass of water") {
    return {
      icon: <GlassWater className="h-6 w-6 text-reminder-water-icon" strokeWidth={2} />,
      className: "bg-reminder-water",
      label: "Drink water",
    };
  }
  if (name === "Take a short walk") {
    return {
      icon: <Footprints className="h-6 w-6 text-reminder-walk-icon" strokeWidth={2} />,
      className: "bg-reminder-walk",
      label: "Take a walk",
    };
  }
  return {
    icon: <Pill className="h-6 w-6 text-reminder-medication-icon" strokeWidth={2} />,
    className: "bg-reminder-medication",
    label: "Medication",
  };
}

function Reminders() {
  const [items, setItems] = useState<Reminder[]>(initialReminders);
  const [banner, setBanner] = useState<string | null>(null);
  const [tomorrowOpen, setTomorrowOpen] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = useNow() ?? new Date(2000, 0, 1, 0, 0);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const announce = (message: string) => {
    setBanner(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBanner(null), 3500);
  };

  const markDone = (item: Reminder) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, doneAt: nowLabel() } : i)));
    announce(`${item.name} marked as done`);
  };

  const undo = (item: Reminder) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, doneAt: undefined } : i)));
    announce(`${item.name} moved back to today's reminders`);
  };

  const rows = items
    .map((i) => {
      // Tasks are lightweight: pending or done only — no due/missed urgency states.
      const state: MedTimeState =
        i.kind === "task" ? (i.doneAt ? "taken" : "upcoming") : medState(i.time, i.doneAt, now);
      return { ...i, state };
    })
    .sort(byPriority);

  const primaryId = (rows.find((r) => r.state === "due") ?? rows.find((r) => r.state === "missed"))?.id;

  const allDone = rows.every((r) => r.state === "taken");

  return (
    <PageShell>
      <h1 className="text-3xl font-medium">Today&apos;s reminders</h1>
      <p className="mb-6 mt-2 text-lg text-muted-foreground">
        Everything on your schedule for today, in order.
      </p>

      <ConfirmationBanner message={banner} />

      {allDone ? (
        <section className="rounded-2xl bg-card p-5">
          <MedicationCard state="empty" nextReminderTime={tomorrow[0]?.time ?? "8:00 AM"} />
        </section>
      ) : (
        <div className="flex flex-col gap-8">
          {sections.map((section) => {
            const sectionRows = rows.filter((r) => section.states.includes(r.state));
            if (sectionRows.length === 0) return null;
            return (
              <section key={section.label}>
                <h2 className="mb-3 text-2xl font-semibold">{section.label}</h2>
                <div className="flex flex-col divide-y divide-divider rounded-2xl bg-card p-5">
                  {sectionRows.map((item) =>
                    item.kind === "task" ? (
                      <TaskRow
                        key={item.id}
                        label={item.name}
                        completedAt={item.doneAt ?? null}
                        onToggle={() => (item.doneAt ? undo(item) : markDone(item))}
                      />
                    ) : (
                      <MedicationCard
                        key={item.id}
                        emphasis={item.id === primaryId ? "primary" : "secondary"}
                        state={item.state}
                        name={item.name}
                        time={item.time}
                        takenAt={item.doneAt}
                        onMarkTaken={() => markDone(item)}
                        onUndo={() => undo(item)}
                      />
                    ),
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-4">
          <button
            type="button"
            onClick={() => setTomorrowOpen((v) => !v)}
            aria-expanded={tomorrowOpen}
            className="flex items-center gap-2 text-2xl font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Tomorrow
            <ChevronDown
              aria-hidden="true"
              strokeWidth={2}
              className={`h-6 w-6 text-muted-foreground transition-transform ${
                tomorrowOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </h2>
        {tomorrowOpen && (
          <div className="flex flex-col gap-8">
            {tomorrowGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.label}>
                  <h3 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
                    <GroupIcon
                      aria-hidden="true"
                      strokeWidth={2}
                      className="h-7 w-7 text-muted-foreground"
                    />
                    {group.label}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.items.map((item) => {
                      const { icon, className: iconBg } = tomorrowItemIcon(item.name);
                      return (
                        <li
                          key={`${item.name}-${item.time}`}
                          className="flex min-h-[72px] items-center gap-4 rounded-2xl bg-neutral-row px-5 py-4"
                        >
                          <span
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}
                            aria-label={tomorrowItemIcon(item.name).label}
                          >
                            {icon}
                          </span>
                          <div>
                            <p className="text-lg font-semibold">{item.name}</p>
                            <p className="text-[15px] text-muted-foreground">{item.time}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
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
      className="flex min-h-[88px] w-full items-center gap-4 px-2 py-4 text-left"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 ${
          completedAt ? "border-primary bg-primary" : "border-primary/30 bg-tint"
        }`}
      >
        {completedAt && <Check className="h-5 w-5 text-card" strokeWidth={3} />}
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
