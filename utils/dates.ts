import type { OpenDay } from "../db.ts";

export function formatNextOpenDay(day: OpenDay | null): string {
  if (!day) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(day.date + "T00:00:00");
  const diffDays = Math.round(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let label: string;
  if (diffDays < 0) return "";
  else if (diffDays === 0) label = "I dag";
  else if (diffDays === 1) label = "I morgen";
  else {
    const weekday = date.toLocaleDateString("nb-NO", { weekday: "short" });
    const d = date.getDate();
    const month = date.toLocaleDateString("nb-NO", { month: "short" });
    label = `${weekday} ${d}. ${month}`;
  }

  if (day.time_from) {
    label += ` kl. ${day.time_from}`;
  }

  return label;
}
