import { useEffect, useState } from "react";

/** Current device time, refreshed on an interval (client only, SSR-safe). */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
