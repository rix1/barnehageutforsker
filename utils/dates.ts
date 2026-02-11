import type { OpenDay } from "../db.ts";

export interface FormattedOpenDay {
  label: string;
  relative: string | null;
  isPast: boolean;
}

export function formatNextOpenDay(day: OpenDay | null): FormattedOpenDay | null {
  if (!day) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(day.date + "T00:00:00");
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  const weekday = date.toLocaleDateString("nb-NO", { weekday: "short" });
  const d = date.getDate();
  const month = date.toLocaleDateString("nb-NO", { month: "short" });
  const dateStr = `${weekday} ${d}. ${month}`;
  const timeStr = day.time_from ? ` kl. ${day.time_from}` : "";

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    let relative: string;
    if (abs === 1) relative = "i g\u00E5r";
    else if (abs < 7) relative = `for ${abs} dager siden`;
    else {
      const weeks = Math.round(abs / 7);
      relative = weeks === 1 ? "forrige uke" : `for ${weeks} uker siden`;
    }
    return { label: dateStr + timeStr, relative, isPast: true };
  }

  if (diffDays === 0) {
    return { label: "I dag" + timeStr, relative: null, isPast: false };
  }

  if (diffDays === 1) {
    return { label: "I morgen" + timeStr, relative: null, isPast: false };
  }

  let relative: string;
  if (diffDays < 7) relative = `om ${diffDays} dager`;
  else if (diffDays < 14) relative = "neste uke";
  else {
    const weeks = Math.round(diffDays / 7);
    relative = `om ${weeks} uker`;
  }

  return { label: dateStr + timeStr, relative, isPast: false };
}
