import type { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto w-full max-w-[860px]">{children}</div>
      </main>
    </div>
  );
}
