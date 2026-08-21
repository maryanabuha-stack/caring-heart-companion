import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageShell } from "@/components/carenest/PageShell";
import { ConfirmationBanner } from "@/components/carenest/ConfirmationBanner";
import { MedicationCard } from "@/components/carenest/MedicationCard";
import { useNow } from "@/hooks/use-now";
import { byPriority, medState, nowLabel } from "@/lib/med-time";

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

const sections: { label: string; states: string[] }[] = [
  { label: "Needs attention", states: ["missed", "due"] },
  { label: "Later today", states: ["upcoming"] },
  { label: "Completed", states: ["taken"] },
];

const tomorrow = [
  { name: "Lisinopril", time: "8:00 AM" },
  { name: "Vitamin D", time: "9:00 AM" },
  { name: "Drink a glass of water", time: "9:30 AM" },
  { name: "Metformin", time: "12:30 PM" },
  { name: "Aspirin", time: "2:00 PM" },
  { name: "Take a short walk", time: "3:00 PM" },
  { name: "Atorvastatin", time: "6:00 PM" },
  { name: "Melatonin", time: "9:00 PM" },
];

function Reminders() {
  const [items, setItems] = useState<Reminder[]>(initialReminders);
  const [banner, setBanner] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const now = useNow() ?? new Date(2000, 0, 1, 0, 0);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

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
      const state = medState(i.time, i.doneAt, now);
      // Tasks never go to a "missed" state — they stay pending until done.
      return { ...i, state: i.kind === "task" && state === "missed" ? ("due" as const) : state };
    })
    .sort(byPriority);

  const allDone = rows.every((r) => r.state === "taken");

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold">Today&apos;s reminders</h1>
      <p className="mb-6 mt-2 text-lg text-muted-foreground">
        Everything on your schedule for today, in order.
      </p>

      <ConfirmationBanner message={banner} />

      <section className="rounded-2xl bg-card p-5">
        {allDone ? (
          <MedicationCard state="empty" nextReminderTime={tomorrow[0]?.time ?? "8:00 AM"} />
        ) : (
          <div className="flex flex-col">
            {sections.map((section, sectionIndex) => {
              const sectionRows = rows.filter((r) => section.states.includes(r.state));
              if (sectionRows.length === 0) return null;
              return (
                <div key={section.label} className={sectionIndex === 0 ? "" : "mt-10"}>
                  <p className="mb-3 text-sm font-medium text-muted-foreground">{section.label}</p>
                  <div className="flex flex-col gap-6">
                    {sectionRows.map((item) => (
                      <MedicationCard
                        key={item.id}
                        state={item.state}
                        name={item.name}
                        time={item.time}
                        takenAt={item.doneAt}
                        onMarkTaken={() => markDone(item)}
                        onUndo={() => undo(item)}
                        className="border border-border shadow-sm"
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold">Tomorrow</h2>
        <div className="rounded-2xl bg-card px-6 py-4">
          <ul className="flex flex-col">
            {tomorrow.map((item) => (
              <li
                key={`${item.name}-${item.time}`}
                className="border-b border-border py-3 text-lg last:border-b-0"
              >
                {item.name} — {item.time}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
