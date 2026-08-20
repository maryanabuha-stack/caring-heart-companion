import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Check,
  Frown,
  Meh,
  Smile,
  SmilePlus,
  Laugh,
} from "lucide-react";
import { PageShell } from "@/components/carenest/PageShell";

export const Route = createFileRoute("/symptom-tracking")({
  head: () => ({
    meta: [
      { title: "Daily Check-in — CareNest" },
      {
        name: "description",
        content:
          "A quick 15-second wellbeing check-in: choose how you feel, add optional symptoms and a note, and save it to your CareNest history.",
      },
      { property: "og:title", content: "Daily Check-in — CareNest" },
      {
        property: "og:description",
        content:
          "Log how you're feeling today with large, simple controls and see your recent check-ins in plain language.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SymptomTracking,
});

const moods = [
  { id: "not-well", label: "Not well", icon: Frown },
  { id: "okay", label: "Okay", icon: Meh },
  { id: "fine", label: "Fine", icon: Smile },
  { id: "good", label: "Good", icon: SmilePlus },
  { id: "great", label: "Great", icon: Laugh },
] as const;

const symptoms = [
  "Headache",
  "Tired",
  "Dizzy",
  "Pain",
  "Nausea",
  "Trouble sleeping",
] as const;

type Entry = { day: string; mood: string; symptoms: string[] };

const initialEntries: Entry[] = [
  { day: "Yesterday", mood: "Good", symptoms: [] },
  { day: "Monday", mood: "Okay", symptoms: ["Headache", "Tired"] },
  { day: "Sunday", mood: "Fine", symptoms: ["Tired"] },
];

function SymptomTracking() {
  const [mood, setMood] = useState<string | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [banner, setBanner] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const toggleSymptom = (s: string) =>
    setPicked((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const save = () => {
    const moodLabel = moods.find((m) => m.id === mood)?.label ?? "";
    setEntries((prev) => [
      { day: "Today", mood: moodLabel, symptoms: picked },
      ...prev.filter((e) => e.day !== "Today"),
    ]);
    setBanner("Your check-in for today has been saved");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBanner(null), 3500);
  };

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold">How are you feeling today?</h1>
      <p className="mb-6 mt-2 text-[15px] text-muted-foreground">
        Choose how you feel, add details if you&apos;d like, and save. It only takes a moment.
      </p>

      <div aria-live="polite" className="min-h-0">
        {banner && (
          <div className="mb-6 flex min-h-[64px] items-center gap-3 rounded-2xl bg-tint px-5 py-4">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <p className="text-lg font-medium text-tint-foreground">{banner}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">Choose how you feel</h2>
          <div
            role="radiogroup"
            aria-label="How are you feeling today?"
            className="grid grid-cols-2 gap-4 rounded-2xl bg-card p-5 sm:grid-cols-5"
          >
            {moods.map((m) => {
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMood(m.id)}
                  className={`flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-4 transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-neutral-row text-foreground hover:bg-tint"
                  }`}
                >
                  <m.icon className="h-9 w-9" aria-hidden="true" />
                  <span className="text-lg font-semibold">{m.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Any symptoms today? (optional)</h2>
          <div className="flex flex-wrap gap-3 rounded-2xl bg-card p-5">
            {symptoms.map((s) => {
              const selected = picked.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleSymptom(s)}
                  className={`flex min-h-[56px] items-center gap-2 rounded-2xl border-2 px-6 text-lg font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-neutral-row text-foreground hover:bg-tint"
                  }`}
                >
                  {selected && <Check className="h-5 w-5" aria-hidden="true" />}
                  {s}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            <label htmlFor="checkin-note">Add a note (optional)</label>
          </h2>
          <div className="rounded-2xl bg-card p-5">
            <textarea
              id="checkin-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything else you'd like to mention..."
              className="w-full resize-none rounded-2xl border-2 border-border bg-neutral-row px-5 py-4 text-lg outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </section>

        <button
          type="button"
          disabled={mood === null}
          onClick={save}
          className="min-h-[64px] w-full rounded-2xl bg-primary text-xl font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-neutral-row disabled:text-muted-foreground disabled:opacity-100"
        >
          Save
        </button>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Recent entries</h2>
          <div className="flex flex-col gap-3 rounded-2xl bg-card p-5">
            {entries.slice(0, 3).map((e) => (
              <div
                key={e.day}
                className="flex min-h-[72px] flex-wrap items-center gap-2 rounded-2xl bg-row px-5 py-4"
              >
                <p className="text-xl font-semibold">{e.day}:</p>
                <p className="text-lg text-muted-foreground">
                  {e.mood} —{" "}
                  {e.symptoms.length === 0 ? "no symptoms noted" : e.symptoms.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
