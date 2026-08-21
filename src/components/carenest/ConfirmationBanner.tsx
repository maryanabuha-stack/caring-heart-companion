import { CheckCircle2 } from "lucide-react";

export function ConfirmationBanner({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      {message && (
        <div className="flex min-h-[64px] max-w-[720px] items-center gap-3 rounded-2xl bg-tint px-5 py-4 shadow-lg">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-success" />
          <p className="text-lg font-medium text-tint-foreground">{message}</p>
        </div>
      )}
    </div>
  );
}
