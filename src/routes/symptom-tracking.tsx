import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/carenest/PageShell";

export const Route = createFileRoute("/symptom-tracking")({
  head: () => ({
    meta: [
      { title: "Symptom Tracking — CareNest" },
      { name: "description", content: "Log how you're feeling today in CareNest with simple, large, accessible controls." },
      { property: "og:title", content: "Symptom Tracking — CareNest" },
      { property: "og:description", content: "Log how you're feeling today in CareNest with simple, large, accessible controls." },
    ],
  }),
  component: () => (
    <PageShell>
      <h1 className="mb-4 text-3xl font-semibold">Symptom Tracking</h1>
      <p className="rounded-2xl bg-card px-6 py-5 text-lg text-muted-foreground">
        Log how you&apos;re feeling today. This screen is coming next.
      </p>
    </PageShell>
  ),
});
