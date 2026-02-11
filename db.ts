import kindergartensData from "./data/kindergartens.json" with { type: "json" };
import openDaysData from "./data/open_days.json" with { type: "json" };

export interface Kindergarten {
  id: number;
  name: string;
  url: string;
  type: string | null;
  district: string | null;
  category: string | null;
  address: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  leader_name: string | null;
  age_range: string | null;
  num_children: number | null;
  indoor_space_per_child: number | null;
  children_per_employee: number | null;
  teacher_education_pct: number | null;
  monthly_tuition: number | null;
  monthly_food_fee: number | null;
  latitude: number | null;
  longitude: number | null;
  thumbnail_url: string | null;
  survey_overall_satisfaction: number | null;
  opening_hours_from: string | null;
  opening_hours_to: string | null;
  next_open_day: OpenDay | null;
  open_days: OpenDay[];
}

export interface OpenDay {
  date: string;
  time_from: string | null;
  time_to: string | null;
  note: string | null;
}

export function getAllKindergartens(): Kindergarten[] {
  const today = new Date().toISOString().slice(0, 10);

  // Group open days by kindergarten_id
  const byKindergarten = new Map<number, OpenDay[]>();
  for (const row of openDaysData as any[]) {
    const days = byKindergarten.get(row.kindergarten_id) || [];
    days.push({
      date: row.date,
      time_from: row.time_from,
      time_to: row.time_to,
      note: row.note,
    });
    byKindergarten.set(row.kindergarten_id, days);
  }

  return (kindergartensData as any[]).map((k) => {
    const days = byKindergarten.get(k.id) || [];
    const upcoming = days.filter((d) => d.date >= today);
    return {
      ...k,
      open_days: upcoming,
      next_open_day: upcoming.length > 0 ? upcoming[0] : null,
    };
  });
}
