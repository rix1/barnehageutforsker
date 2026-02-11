import { useEffect, useState } from "preact/hooks";
import type { Kindergarten } from "../db.ts";
import { formatNextOpenDay } from "../utils/dates.ts";
import {
  getSortFromURL,
  getStarredFromURL,
  updateSortURL,
  updateStarredURL,
} from "../utils/starred.ts";

interface Props {
  data: Kindergarten[];
}

type SortKey = keyof Kindergarten | "thumbnail" | "starred";
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string; class?: string }[] = [
  { key: "starred", label: "\u2605", class: "text-center" },
  { key: "thumbnail", label: "" },
  { key: "name", label: "Navn" },
  { key: "type", label: "Type" },
  { key: "district", label: "Bydel" },
  { key: "num_children", label: "Barn", class: "text-right" },
  {
    key: "indoor_space_per_child",
    label: "m\u00B2/barn",
    class: "text-right",
  },
  { key: "children_per_employee", label: "Barn/ansatt", class: "text-right" },
  {
    key: "teacher_education_pct",
    label: "Ped.andel",
    class: "text-right",
  },
  {
    key: "survey_overall_satisfaction",
    label: "Tilfredshet",
    class: "text-right",
  },
  { key: "opening_hours_from", label: "Åpner", class: "text-right" },
  { key: "opening_hours_to", label: "Stenger", class: "text-right" },
  { key: "next_open_day", label: "Neste besøk" },
];

export default function KindergartenTable({ data }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [starred, setStarred] = useState<Set<number>>(new Set());
  const [filterType, setFilterType] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string>("");

  useEffect(() => {
    setStarred(getStarredFromURL());
    const sort = getSortFromURL("name", "asc");
    setSortKey(sort.key as SortKey);
    setSortDir(sort.dir);
  }, []);

  const toggleStar = (id: number) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      updateStarredURL(next);
      return next;
    });
  };

  const districts = [
    ...new Set(data.map((k) => k.district).filter(Boolean)),
  ].sort((a, b) => a!.localeCompare(b!, "nb")) as string[];

  const filtered = data.filter((k) => {
    if (filterType && k.type !== filterType) return false;
    if (filterDistrict && k.district !== filterDistrict) return false;
    return true;
  });

  const handleSort = (key: SortKey) => {
    let newDir: SortDir;
    if (key === sortKey) {
      newDir = sortDir === "asc" ? "desc" : "asc";
    } else {
      newDir = key === "starred" ? "desc" : "asc";
    }
    setSortKey(key);
    setSortDir(newDir);
    updateSortURL(key, newDir, "name");
  };

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "starred") {
      const as = starred.has(a.id) ? 1 : 0;
      const bs = starred.has(b.id) ? 1 : 0;
      return sortDir === "asc" ? as - bs : bs - as;
    }
    if (sortKey === "next_open_day") {
      const ad = a.next_open_day?.date ?? "9999";
      const bd = b.next_open_day?.date ?? "9999";
      const cmp = ad.localeCompare(bd);
      return sortDir === "asc" ? cmp : -cmp;
    }
    const av = a[sortKey as keyof Kindergarten];
    const bv = b[sortKey as keyof Kindergarten];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = typeof av === "string"
      ? av.localeCompare(bv as string, "nb")
      : (av as number) - (bv as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const arrow = (key: SortKey) => {
    if (key !== sortKey) {
      return <span class="text-gray-300 ml-1">&nbsp;</span>;
    }
    return (
      <span class="text-oslo-yellow ml-1">
        {sortDir === "asc" ? "\u2191" : "\u2193"}
      </span>
    );
  };

  return (
    <div>
      {/* Filters */}
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType((e.target as HTMLSelectElement).value)}
          class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-oslo-navy focus:outline-none focus:ring-2 focus:ring-oslo-navy/20"
        >
          <option value="">Alle typer</option>
          <option value="Kommunal">Kommunal</option>
          <option value="Privat">Privat</option>
        </select>
        <select
          value={filterDistrict}
          onChange={(e) =>
            setFilterDistrict((e.target as HTMLSelectElement).value)}
          class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-oslo-navy focus:outline-none focus:ring-2 focus:ring-oslo-navy/20"
        >
          <option value="">Alle bydeler</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d.replace("Bydel ", "")}
            </option>
          ))}
        </select>
        <span class="text-sm text-gray-500">
          {filtered.length} barnehager
          {starred.size > 0 && ` \u00B7 ${starred.size} favoritter`}
        </span>
      </div>

      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-oslo-navy text-white">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  class={`px-3 py-2.5 font-medium cursor-pointer select-none hover:bg-oslo-navy-light whitespace-nowrap transition-colors ${
                    col.class ?? "text-left"
                  }`}
                >
                  {col.label}
                  {arrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {sorted.map((k, i) => (
              <tr
                key={k.id}
                class={`hover:bg-oslo-yellow-light transition-colors ${
                  starred.has(k.id)
                    ? "bg-oslo-yellow-light/50"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50/50"
                }`}
              >
                <td class="px-3 py-2 text-center">
                  <button
                    onClick={() => toggleStar(k.id)}
                    class={`text-lg leading-none transition-colors ${
                      starred.has(k.id)
                        ? "text-oslo-yellow"
                        : "text-gray-300 hover:text-oslo-yellow/60"
                    }`}
                  >
                    {starred.has(k.id) ? "\u2605" : "\u2606"}
                  </button>
                </td>
                <td>
                  {k.thumbnail_url && (
                    <img
                      src={k.thumbnail_url}
                      alt=""
                      class="w-8 h-8 rounded-full object-cover"
                      loading="lazy"
                    />
                  )}
                </td>
                <td class="px-3 py-2">
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-oslo-navy hover:underline font-medium"
                  >
                    {k.name}
                  </a>
                </td>
                <td class="px-3 py-2">
                  <span
                    class={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      k.type === "Kommunal"
                        ? "bg-oslo-navy text-white"
                        : "bg-oslo-yellow text-oslo-navy"
                    }`}
                  >
                    {k.type}
                  </span>
                </td>
                <td class="px-3 py-2 text-gray-600 whitespace-nowrap">
                  {k.district?.replace("Bydel ", "")}
                </td>
                <td class="px-3 py-2 text-right tabular-nums">
                  {k.num_children ?? "\u2013"}
                </td>
                <td class="px-3 py-2 text-right tabular-nums">
                  {k.indoor_space_per_child ?? "\u2013"}
                </td>
                <td class="px-3 py-2 text-right tabular-nums">
                  {k.children_per_employee ?? "\u2013"}
                </td>
                <td class="px-3 py-2 text-right tabular-nums">
                  {k.teacher_education_pct != null
                    ? `${k.teacher_education_pct}%`
                    : "\u2013"}
                </td>
                <td class="px-3 py-2 text-right tabular-nums">
                  {k.survey_overall_satisfaction != null
                    ? `${k.survey_overall_satisfaction}`
                    : "\u2013"}
                </td>
                <td class="px-3 py-2 text-right tabular-nums text-gray-600">
                  {k.opening_hours_from ?? "\u2013"}
                </td>
                <td class="px-3 py-2 text-right tabular-nums text-gray-600">
                  {k.opening_hours_to ?? "\u2013"}
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  {k.next_open_day
                    ? (
                      <span class="text-oslo-green font-medium text-xs">
                        {formatNextOpenDay(k.next_open_day)}
                      </span>
                    )
                    : k.open_days.length === 0
                    ? <span class="text-gray-300">\u2013</span>
                    : (
                      <span class="text-gray-400 text-xs italic">
                        Ingen flere
                      </span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
