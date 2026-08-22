import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Phone, MessageSquare, HandHelping, Send } from "lucide-react";
import { PageShell } from "@/components/carenest/PageShell";
import { ConfirmationBanner } from "@/components/carenest/ConfirmationBanner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/communication")({
  head: () => ({
    meta: [
      { title: "Contact Your Care Team — CareNest" },
      {
        name: "description",
        content:
          "Call your caregiver, message your doctor, or send a help request from CareNest with large, simple controls.",
      },
      { property: "og:title", content: "Contact Your Care Team — CareNest" },
      {
        property: "og:description",
        content:
          "A simple contact channel for your caregiver and doctor: quick actions, one-tap replies and a plain message box.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Communication,
});

const CAREGIVER = "Sarah";
const CAREGIVER_PHONE = "+1 (555) 014-2837";
const CAREGIVER_TEL = "+15550142837";

type Message = { id: string; name: string; role: string; preview: string; time: string; initials: string };

const initialMessages: Message[] = [
  {
    id: "m1",
    name: "Sarah",
    role: "Caregiver",
    initials: "SB",
    preview: "I'll drop by around 4pm with your prescription.",
    time: "Today, 10:15 AM",
  },
  {
    id: "m2",
    name: "Dr. Bowman",
    role: "GP",
    initials: "DB",
    preview: "Your blood pressure readings look good. Keep taking Lisinopril.",
    time: "Yesterday, 3:40 PM",
  },
  {
    id: "m3",
    name: "Sarah",
    role: "Caregiver",
    initials: "SB",
    preview: "Remember to drink water with your afternoon tablet.",
    time: "Monday, 1:05 PM",
  },
];

const quickReplies = ["I'm okay", "I have a question", "I need help"] as const;

function nowLabel() {
  return `Today, ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

function Communication() {
  const [banner, setBanner] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [confirmHelp, setConfirmHelp] = useState(false);
  const [confirmCall, setConfirmCall] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const announce = (message: string) => {
    setBanner(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setBanner(null), 3500);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      { id: `${Date.now()}`, name: "You", role: "to your care team", initials: "ME", preview: trimmed, time: nowLabel() },
      ...prev,
    ]);
    announce("Message sent");
  };

  const VISIBLE_LIMIT = 5;
  const visibleMessages = messages.slice(0, VISIBLE_LIMIT);
  const hasEarlier = messages.length > VISIBLE_LIMIT;

  const tiles = [
    {
      label: "Call my caregiver",
      icon: Phone,
      onClick: () => setConfirmCall(true),
      strong: false,
    },
    {
      label: "Message care team",
      icon: MessageSquare,
      onClick: () => composeRef.current?.focus(),
      strong: false,
    },
    {
      label: "Request help now",
      icon: HandHelping,
      onClick: () => setConfirmHelp(true),
      strong: true,
    },
  ];

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold">Contact your care team</h1>
      <p className="mb-6 mt-2 text-[15px] text-muted-foreground">
        Call, message, or ask for help. Your whole care team can see messages here, and someone
        will get back to you.
      </p>

      <ConfirmationBanner message={banner} />

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="sr-only">Quick actions</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {tiles.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={t.onClick}
                className={`flex min-h-[132px] flex-col items-start justify-between gap-4 rounded-2xl border-2 p-5 text-left text-xl font-semibold transition-colors ${
                  t.strong
                    ? "border-primary bg-primary text-primary-foreground hover:opacity-90"
                    : "border-border bg-card text-foreground hover:bg-tint"
                }`}
              >
                <t.icon className="h-9 w-9 shrink-0" aria-hidden="true" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Recent messages</h2>
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-row px-6 py-10 text-center">
                <MessageSquare className="h-14 w-14 text-muted-foreground" strokeWidth={2} aria-hidden="true" />
                <p className="text-2xl font-semibold">No messages yet</p>
                <p className="text-lg text-muted-foreground">
                  Messages from your care team will appear here.
                </p>
              </div>
            ) : (
              visibleMessages.map((m) => (
                <div key={m.id} className="flex min-h-[72px] gap-4 rounded-2xl bg-row px-5 py-4">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint text-base font-semibold text-tint-foreground"
                  >
                    {m.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-semibold">
                      {m.name}
                      <span className="font-normal text-muted-foreground">, {m.role}</span>
                    </p>
                    <p className="mt-1 text-lg">{m.preview}</p>
                    <p className="mt-1 text-base text-muted-foreground">{m.time}</p>
                  </div>
                </div>
              ))
            )}
            {hasEarlier && (
              <button
                type="button"
                // Placeholder: this is where earlier message history would load.
                onClick={() => announce("Earlier messages will appear here")}
                className="mt-1 self-center bg-transparent px-2 py-2 text-lg font-medium text-primary underline-offset-4 hover:underline"
              >
                View earlier messages
              </button>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">
            <label htmlFor="compose">Write a message</label>
          </h2>
          <div className="rounded-2xl bg-card p-5">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Quick replies</p>
            <div className="flex flex-wrap gap-3">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="min-h-[56px] flex-1 rounded-2xl border-2 border-border bg-neutral-row px-6 text-lg font-medium transition-colors hover:bg-tint"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
            <input
              id="compose"
              ref={composeRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[64px] flex-1 rounded-2xl border-2 border-border bg-neutral-row px-5 text-lg outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="button"
              disabled={draft.trim().length === 0}
              onClick={() => {
                sendMessage(draft);
                setDraft("");
              }}
              className="flex min-h-[64px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-xl font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-neutral-row disabled:text-muted-foreground disabled:opacity-100"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
              Send
            </button>
            </div>
          </div>
        </section>
      </div>

      <AlertDialog open={confirmHelp} onOpenChange={setConfirmHelp}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">Send a help request to {CAREGIVER}?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              {CAREGIVER} will be notified right away that you need help.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="min-h-[56px] rounded-2xl px-8 text-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[56px] rounded-2xl bg-primary px-8 text-lg text-primary-foreground"
              onClick={() => announce(`Help request sent to ${CAREGIVER}`)}
            >
              Yes, send
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmCall} onOpenChange={setConfirmCall}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              Call {CAREGIVER} at {CAREGIVER_PHONE}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg">
              This will open your phone app to start the call.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="min-h-[56px] rounded-2xl px-8 text-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              asChild
              className="min-h-[56px] rounded-2xl bg-primary px-8 text-lg text-primary-foreground"
            >
              <a
                href={`tel:${CAREGIVER_TEL}`}
                onClick={() => announce(`Opening your phone to call ${CAREGIVER}`)}
              >
                Yes, call
              </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}
