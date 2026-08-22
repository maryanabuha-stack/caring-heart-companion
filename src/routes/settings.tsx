import { createFileRoute } from "@tanstack/react-router";
import { Check, Type, Contrast as ContrastIcon } from "lucide-react";
import { PageShell } from "@/components/carenest/PageShell";
import { useAppSettings, type TextSize, type Contrast } from "@/hooks/use-app-settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Display Settings — CareNest" },
      {
        name: "description",
        content:
          "Make CareNest easier to read: choose a larger text size and switch on high contrast for clearer borders and text.",
      },
      { property: "og:title", content: "Display Settings — CareNest" },
      {
        property: "og:description",
        content: "Adjust text size and contrast across every CareNest screen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const textSizes: { id: TextSize; label: string; sample: string }[] = [
  { id: "normal", label: "Normal", sample: "text-lg" },
  { id: "large", label: "Large", sample: "text-2xl" },
  { id: "xlarge", label: "Extra large", sample: "text-3xl" },
];

const contrasts: { id: Contrast; label: string; hint: string }[] = [
  { id: "standard", label: "Standard contrast", hint: "The usual soft colours." },
  { id: "high", label: "High contrast", hint: "Darker text and clearer card borders." },
];

function SettingsPage() {
  const { settings, update } = useAppSettings();

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mb-6 mt-2 text-[15px] text-muted-foreground">
        Make CareNest easier to read. Your choice is saved and applies to every screen.
      </p>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
            <Type aria-hidden="true" strokeWidth={2} className="h-7 w-7 text-muted-foreground" />
            Text size
          </h2>
          <div
            role="radiogroup"
            aria-label="Text size"
            className="grid gap-4 rounded-2xl bg-card p-5 sm:grid-cols-3"
          >
            {textSizes.map((t) => {
              const selected = settings.textSize === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update({ textSize: t.id })}
                  className={`flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-4 transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-neutral-row text-foreground hover:bg-tint"
                  }`}
                >
                  <span className={`${t.sample} font-semibold`}>Aa</span>
                  <span className="text-lg font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold">
            <ContrastIcon
              aria-hidden="true"
              strokeWidth={2}
              className="h-7 w-7 text-muted-foreground"
            />
            Contrast
          </h2>
          <div
            role="radiogroup"
            aria-label="Contrast"
            className="grid gap-4 rounded-2xl bg-card p-5 sm:grid-cols-2"
          >
            {contrasts.map((c) => {
              const selected = settings.contrast === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update({ contrast: c.id })}
                  className={`flex min-h-[96px] flex-col items-start justify-center gap-1 rounded-2xl border-2 px-5 py-4 text-left transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-neutral-row text-foreground hover:bg-tint"
                  }`}
                >
                  <span className="flex items-center gap-2 text-xl font-semibold">
                    {selected && <Check className="h-6 w-6" aria-hidden="true" />}
                    {c.label}
                  </span>
                  <span
                    className={`text-base ${selected ? "text-primary-foreground/85" : "text-muted-foreground"}`}
                  >
                    {c.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
