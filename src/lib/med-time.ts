export type MedTimeState = "upcoming" | "due" | "missed" | "taken";

/** Minutes after the scheduled time during which a dose still counts as "due now". */
export const DUE_GRACE_MINUTES = 60;

/** Parse a label like "8:00 AM" / "12:30 PM" into minutes since midnight. */
export function parseTimeLabel(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(label.trim());
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

export function minutesOfDay(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/**
 * Derive the medication state from the real current time.
 * Taken doses always stay taken (until the next day's reset).
 */
export function medState(
  timeLabel: string,
  takenAt: string | null | undefined,
  now: Date,
): MedTimeState {
  if (takenAt) return "taken";
  const scheduled = parseTimeLabel(timeLabel);
  if (scheduled === null) return "upcoming";
  const current = minutesOfDay(now);
  if (current < scheduled) return "upcoming";
  if (current <= scheduled + DUE_GRACE_MINUTES) return "due";
  return "missed";
}

export const stateOrder: Record<MedTimeState, number> = {
  missed: 0,
  due: 1,
  upcoming: 2,
  taken: 3,
};

export function byPriority<T extends { state: MedTimeState; time: string }>(a: T, b: T) {
  const diff = stateOrder[a.state] - stateOrder[b.state];
  if (diff !== 0) return diff;
  return (parseTimeLabel(a.time) ?? 0) - (parseTimeLabel(b.time) ?? 0);
}

export function nowLabel(date: Date = new Date()) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
