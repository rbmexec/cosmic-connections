import { transitEvents, type TransitEvent } from "@/data/cosmic-events";

/**
 * Returns transit events that are currently active and either:
 * - Affect the user's zodiac sign, or
 * - Have high severity (relevant to everyone)
 */
export function getActiveAlerts(
  userZodiac: string,
  date?: Date,
): TransitEvent[] {
  const now = date ?? new Date();
  const nowTime = now.getTime();

  return transitEvents.filter((event) => {
    const start = new Date(event.startDate).getTime();
    // End date is inclusive — extend to end of that day
    const end = new Date(event.endDate).getTime() + 86_400_000 - 1;

    if (nowTime < start || nowTime > end) return false;

    return (
      event.severity === "high" ||
      event.affectedSigns.includes(userZodiac)
    );
  });
}

/**
 * Returns transit events whose start date falls within the next N days
 * from the reference date, sorted chronologically.
 */
export function getUpcomingEvents(
  days: number,
  date?: Date,
): TransitEvent[] {
  const now = date ?? new Date();
  const nowTime = now.getTime();
  const horizonTime = nowTime + days * 86_400_000;

  return transitEvents
    .filter((event) => {
      const start = new Date(event.startDate).getTime();
      return start >= nowTime && start <= horizonTime;
    })
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
}
