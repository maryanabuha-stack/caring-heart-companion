import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/carenest/PageShell";
import { MedicationCard } from "@/components/carenest/MedicationCard";

export const Route = createFileRoute("/reminders")({
  head: () => ({
    meta: [
      { title: "Reminders — CareNest" },
      { name: "description", content: "See upcoming CareNest reminders and when the next one is due." },
      { property: "og:title", content: "Reminders — CareNest" },
      { property: "og:description", content: "See upcoming CareNest reminders and when the next one is due." },
    ],
  }),
  component: () => (
    <PageShell>
      <h1 className="mb-6 text-3xl font-semibold">Reminders</h1>
      <div className="rounded-2xl bg-card p-5">
        <MedicationCard state="empty" nextReminderTime="8:00 AM" />
      </div>
    </PageShell>
  ),
});
