/**
 * Calendar-date helpers. Dates are ISO `YYYY-MM-DD` strings interpreted in the
 * bakery timezone; callers pass "today" explicitly so logic stays deterministic.
 */
export type IsoDate = string;

const DAY_MS = 86_400_000;

function toUtcMs(date: IsoDate): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function diffInDays(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return new Date(toUtcMs(date) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Today's date in the given IANA timezone, as YYYY-MM-DD. */
export function todayInTimezone(timezone: string, now: Date = new Date()): IsoDate {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
