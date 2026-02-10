export function getStarredFromURL(): Set<number> {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("f");
  if (!raw) return new Set();
  return new Set(raw.split(",").map(Number).filter((n) => !isNaN(n) && n > 0));
}

export function getSortFromURL(
  defaultKey: string,
  defaultDir: "asc" | "desc",
): { key: string; dir: "asc" | "desc" } {
  const params = new URLSearchParams(window.location.search);
  const key = params.get("s") || defaultKey;
  const dir = params.get("d") === "desc" ? "desc" : params.get("d") === "asc" ? "asc" : defaultDir;
  return { key, dir };
}

function updateURL(updates: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search);
  for (const [k, v] of Object.entries(updates)) {
    if (v === null) params.delete(k);
    else params.set(k, v);
  }
  const search = params.toString();
  const newURL = window.location.pathname + (search ? "?" + search : "");
  history.replaceState(null, "", newURL);
}

export function updateStarredURL(ids: Set<number>) {
  updateURL({
    f: ids.size === 0 ? null : [...ids].sort((a, b) => a - b).join(","),
  });
}

export function updateSortURL(key: string, dir: string, defaultKey: string) {
  updateURL({
    s: key === defaultKey && dir === "asc" ? null : key,
    d: key === defaultKey && dir === "asc" ? null : dir,
  });
}
