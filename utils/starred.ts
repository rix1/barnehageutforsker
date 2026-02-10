export function getStarredFromURL(): Set<number> {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("f");
  if (!raw) return new Set();
  return new Set(raw.split(",").map(Number).filter((n) => !isNaN(n) && n > 0));
}

export function updateStarredURL(ids: Set<number>) {
  const params = new URLSearchParams(window.location.search);
  if (ids.size === 0) {
    params.delete("f");
  } else {
    params.set("f", [...ids].sort((a, b) => a - b).join(","));
  }
  const search = params.toString();
  const newURL = window.location.pathname + (search ? "?" + search : "");
  history.replaceState(null, "", newURL);
}
