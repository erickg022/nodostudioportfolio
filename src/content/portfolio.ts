/**
 * Portfolio views (ALL WORK / VISUAL / TECHNOLOGY) are curated in content/site.json under
 * `portfolio.views`. This helper has no imports so the server page and the browser runtime
 * resolve `?view=` the same way.
 */

export type PortfolioCategory = "visual" | "tech";
export type PortfolioViewId = "all" | "visual" | "tech";

/** `?view=` values that mean the same view as another one. */
const ALIASES: Record<string, string> = { technology: "tech", visuals: "visual" };

/** The view for a `?view=` value; a missing or unknown value falls back to the default view. */
export function resolveView<V extends { id: string; param: string }>(
  views: V[],
  param: string | null | undefined,
  fallbackId: string,
): V {
  const key = (param ?? "").trim().toLowerCase();
  const wanted = ALIASES[key] ?? key;
  return (
    views.find((v) => v.param !== "" && v.param === wanted) ??
    views.find((v) => v.id === fallbackId) ??
    views[0]
  );
}

/** The page URL for a view: the default view drops `?view=`, the others set it. */
export function viewHref(param: string, base = "/") {
  return param ? `${base}?view=${encodeURIComponent(param)}` : base;
}
