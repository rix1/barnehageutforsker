import kindergartensData from "./data/kindergartens.json" with { type: "json" };

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
}

export function getAllKindergartens(): Kindergarten[] {
  return kindergartensData as Kindergarten[];
}
