import { useEffect, useRef, useState } from "preact/hooks";
import type { Kindergarten } from "../db.ts";
import {
  getSortFromURL,
  getStarredFromURL,
  updateSortURL,
  updateStarredURL,
} from "../utils/starred.ts";

interface Props {
  data: Kindergarten[];
}

type SortKey = keyof Kindergarten | "starred";
type SortDir = "asc" | "desc";

function makeIcon(
  L: any,
  k: Kindergarten,
  isStarred: boolean,
  isHighlighted: boolean,
) {
  const size = isHighlighted ? 22 : 14;
  const color = k.type === "Kommunal" ? "#dc2626" : "#1d4ed8";
  const border = "#ffffff";

  if (isStarred) {
    const s = isHighlighted ? 32 : 22;
    return L.divIcon({
      className: "custom-marker",
      html:
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2A2859" fill="#F8C55D" width="${s}" height="${s}" style="filter:drop-shadow(0 1px 3px rgba(0,0,0,0.5));transition:all 0.15s;cursor:pointer"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/></svg>`,
      iconSize: [s, s],
      iconAnchor: [s / 2, s / 2],
    });
  }

  return L.divIcon({
    className: "custom-marker",
    html:
      `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid ${border};box-shadow:0 1px 4px rgba(0,0,0,0.3);transition:all 0.15s;cursor:pointer"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function ExploreView({ data }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const mapInstanceRef = useRef<any>(null);
  const [starred, setStarred] = useState<Set<number>>(new Set());
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selected, setSelected] = useState<Kindergarten | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterType, setFilterType] = useState<string>("");
  const [filterDistrict, setFilterDistrict] = useState<string>("");

  useEffect(() => {
    setStarred(getStarredFromURL());
    const sort = getSortFromURL("name", "asc");
    setSortKey(sort.key as SortKey);
    setSortDir(sort.dir);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    const L = (globalThis as any).L;
    if (!L) return;

    const map = L.map(mapRef.current).setView([59.93, 10.76], 13);
    mapInstanceRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution:
          "&copy; <a href='https://www.openstreetmap.org/copyright'>OSM</a> &copy; <a href='https://carto.com/'>CARTO</a>",
        maxZoom: 19,
      },
    ).addTo(map);

    for (const k of data) {
      if (!k.latitude || !k.longitude) continue;
      const icon = makeIcon(L, k, false, false);
      const marker = L.marker([k.latitude, k.longitude], { icon })
        .addTo(map)
        .on("click", () => setSelected(k));
      markersRef.current.set(k.id, marker);
    }

    // User location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const homeIcon = L.divIcon({
            className: "home-marker",
            html:
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2A2859" fill="#2A2859" width="32" height="32" style="filter:drop-shadow(0 2px 3px rgba(0,0,0,0.4));cursor:default" title="Du er her"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
          L.marker([latitude, longitude], {
            icon: homeIcon,
            zIndexOffset: 2000,
          })
            .addTo(map)
            .bindPopup("Du er her");
        },
        () => {
          /* permission denied or error – just skip */
        },
      );
    }

    return () => map.remove();
  }, []);

  // Update marker icons on hover/star changes
  useEffect(() => {
    const L = (globalThis as any).L;
    if (!L) return;
    for (const k of data) {
      const marker = markersRef.current.get(k.id);
      if (!marker) continue;
      const isHighlighted = k.id === hoveredId || k.id === selected?.id;
      const isStarred = starred.has(k.id);
      marker.setIcon(makeIcon(L, k, isStarred, isHighlighted));
      if (isHighlighted) marker.setZIndexOffset(1000);
      else marker.setZIndexOffset(0);
    }
  }, [hoveredId, starred, selected]);

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
    if (key !== sortKey) return "";
    return sortDir === "asc" ? " \u2191" : " \u2193";
  };

  const handleRowClick = (k: Kindergarten) => {
    setSelected(k);
    if (k.latitude && k.longitude && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([k.latitude, k.longitude], {
        animate: true,
      });
    }
  };

  const cols: { key: SortKey; label: string; right?: boolean }[] = [
    { key: "starred", label: "\u2605" },
    { key: "name", label: "Navn" },
    { key: "type", label: "Type" },
    { key: "num_children", label: "Barn", right: true },
    { key: "children_per_employee", label: "B/A", right: true },
    { key: "survey_overall_satisfaction", label: "Score", right: true },
  ];

  return (
    <div class="flex flex-col md:flex-row h-[calc(100vh-3.5rem)]">
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

      {/* Map panel: top on mobile, right on desktop */}
      <div class="h-[60vh] md:h-auto md:order-2 flex-1 relative">
        <div ref={mapRef} class="w-full h-full z-0" />

        {/* Legend */}
        <div class="absolute bottom-6 left-4 bg-white rounded-lg shadow-md px-3 py-2 z-[1000] text-xs flex gap-3 border border-gray-200">
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-3 h-3 rounded-full bg-red-600 border-2 border-white" />
            <span class="text-oslo-navy font-medium">Kommunal</span>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="inline-block w-3 h-3 rounded-full bg-blue-700 border-2 border-white" />
            <span class="text-oslo-navy font-medium">Privat</span>
          </span>
          <span class="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2A2859"
              fill="#F8C55D"
              class="w-3.5 h-3.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
            <span class="text-oslo-navy font-medium">Favoritt</span>
          </span>
        </div>

        {/* Detail overlay */}
        {selected && (
          <div class="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-xl w-72 overflow-hidden border border-gray-200">
            <div class="bg-oslo-navy px-4 py-2.5 flex justify-between items-start">
              <div class="flex items-start gap-2 pr-2">
                <button
                  onClick={() => toggleStar(selected.id)}
                  class={`text-base leading-none mt-0.5 transition-colors ${
                    starred.has(selected.id)
                      ? "text-oslo-yellow"
                      : "text-white/40 hover:text-oslo-yellow/70"
                  }`}
                >
                  {starred.has(selected.id) ? "\u2605" : "\u2606"}
                </button>
                <h2 class="font-semibold text-white text-sm leading-tight">
                  {selected.name}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                class="text-white/60 hover:text-white text-lg leading-none shrink-0"
              >
                &times;
              </button>
            </div>
            <div class="p-3 text-xs text-gray-700 space-y-1.5">
              <div class="flex gap-1.5">
                <span
                  class={`font-medium px-2 py-0.5 rounded-full ${
                    selected.type === "Kommunal"
                      ? "bg-oslo-navy text-white"
                      : "bg-oslo-yellow text-oslo-navy"
                  }`}
                >
                  {selected.type}
                </span>
                {selected.district && (
                  <span class="font-medium px-2 py-0.5 rounded-full bg-gray-100 text-oslo-navy">
                    {selected.district}
                  </span>
                )}
              </div>
              {selected.address && <p>{selected.address}</p>}
              <div class="grid grid-cols-2 gap-x-3 gap-y-1 pt-1">
                {selected.num_children != null && (
                  <div>
                    <span class="text-gray-400">Barn:</span>{" "}
                    {selected.num_children}
                  </div>
                )}
                {selected.age_range && (
                  <div>
                    <span class="text-gray-400">Alder:</span>{" "}
                    {selected.age_range}
                  </div>
                )}
                {selected.indoor_space_per_child != null && (
                  <div>
                    <span class="text-gray-400">m&sup2;/barn:</span>{" "}
                    {selected.indoor_space_per_child}
                  </div>
                )}
                {selected.children_per_employee != null && (
                  <div>
                    <span class="text-gray-400">B/ansatt:</span>{" "}
                    {selected.children_per_employee}
                  </div>
                )}
                {selected.teacher_education_pct != null && (
                  <div>
                    <span class="text-gray-400">Ped.:</span>{" "}
                    {selected.teacher_education_pct}%
                  </div>
                )}
                {selected.survey_overall_satisfaction != null && (
                  <div>
                    <span class="text-gray-400">Score:</span>{" "}
                    {selected.survey_overall_satisfaction}/5
                  </div>
                )}
              </div>
              {selected.opening_hours_from && selected.opening_hours_to && (
                <p>
                  <span class="text-gray-400">Åpent:</span>{" "}
                  {selected.opening_hours_from}–{selected.opening_hours_to}
                </p>
              )}
              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                class="mt-2 block text-center bg-oslo-navy text-white font-medium px-3 py-2 rounded-lg hover:bg-oslo-navy-light transition-colors"
              >
                oslo.kommune.no &rarr;
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Table panel: bottom on mobile, left on desktop */}
      <div class="h-[40vh] md:h-auto md:order-1 md:w-[45vw] shrink-0 flex flex-col border-t md:border-t-0 md:border-r border-gray-200 bg-white">
        {/* Filters */}
        <div class="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType((e.target as HTMLSelectElement).value)}
            class="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-oslo-navy"
          >
            <option value="">Alle typer</option>
            <option value="Kommunal">Kommunal</option>
            <option value="Privat">Privat</option>
          </select>
          <select
            value={filterDistrict}
            onChange={(e) =>
              setFilterDistrict((e.target as HTMLSelectElement).value)}
            class="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-oslo-navy"
          >
            <option value="">Alle bydeler</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d.replace("Bydel ", "")}
              </option>
            ))}
          </select>
          <span class="text-xs text-gray-400 ml-auto">
            {filtered.length} treff
          </span>
        </div>

        {/* Table */}
        <div class="overflow-y-auto flex-1">
          <table class="w-full text-xs">
            <thead class="sticky top-0 z-10">
              <tr class="bg-oslo-navy text-white">
                {cols.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    class={`px-2 py-2 font-medium cursor-pointer select-none hover:bg-oslo-navy-light whitespace-nowrap ${
                      col.right ? "text-right" : "text-left"
                    }`}
                  >
                    {col.label}
                    <span class="text-oslo-yellow">{arrow(col.key)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {sorted.map((k, i) => (
                <tr
                  key={k.id}
                  onMouseEnter={() => setHoveredId(k.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleRowClick(k)}
                  class={`cursor-pointer transition-colors ${
                    selected?.id === k.id
                      ? "bg-oslo-yellow-light ring-1 ring-inset ring-oslo-yellow"
                      : starred.has(k.id)
                      ? "bg-oslo-yellow-light/50 hover:bg-oslo-yellow-light"
                      : i % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50/50 hover:bg-gray-100/50"
                  }`}
                >
                  <td class="px-2 py-1.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(k.id);
                      }}
                      class={`text-sm leading-none ${
                        starred.has(k.id)
                          ? "text-oslo-yellow"
                          : "text-gray-300 hover:text-oslo-yellow/60"
                      }`}
                    >
                      {starred.has(k.id) ? "\u2605" : "\u2606"}
                    </button>
                  </td>
                  <td class="px-2 py-1.5 font-medium text-oslo-navy truncate max-w-[180px]">
                    {k.name}
                  </td>
                  <td class="px-2 py-1.5">
                    <span
                      class={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        k.type === "Kommunal"
                          ? "bg-oslo-navy text-white"
                          : "bg-oslo-yellow text-oslo-navy"
                      }`}
                    >
                      {k.type === "Kommunal" ? "K" : "P"}
                    </span>
                  </td>
                  <td class="px-2 py-1.5 text-right tabular-nums text-gray-600">
                    {k.num_children ?? "\u2013"}
                  </td>
                  <td class="px-2 py-1.5 text-right tabular-nums text-gray-600">
                    {k.children_per_employee ?? "\u2013"}
                  </td>
                  <td class="px-2 py-1.5 text-right tabular-nums text-gray-600">
                    {k.survey_overall_satisfaction ?? "\u2013"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
