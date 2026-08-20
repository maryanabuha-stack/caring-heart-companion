import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/carenest/PageShell";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Communication — CareNest" },
      { name: "description", content: "Message your doctor or caregiver from CareNest in a calm, readable interface." },
      { property: "og:title", content: "Communication — CareNest" },
      { property: "og:description", content: "Message your doctor or caregiver from CareNest in a calm, readable interface." },
    ],
  }),
  component: () => (
    <PageShell>
      <h1 className="mb-4 text-3xl font-semibold">Communication</h1>
      <p className="rounded-2xl bg-card px-6 py-5 text-lg text-muted-foreground">
        Message your doctor. This screen is coming next.
      </p>
    </PageShell>
  ),
});
