import { leadConsentText, leadInterests, leadRoles } from "@/data/lead-options";

/**
 * Receives lead-form submissions from /recursos and appends them to a Google Sheet
 * through an Apps Script web app (see docs/leads-google-sheet.md).
 *
 * Env vars (server only):
 *   LEADS_WEBHOOK_URL     Apps Script web app URL
 *   LEADS_WEBHOOK_SECRET  shared secret checked by the Apps Script
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (tooMany(ip)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend success so bots don't retry.
  if (str(body.website, 200)) return Response.json({ ok: true });
  // Humans need more than ~2s to fill two steps; scripts that post instantly are dropped quietly.
  if (typeof body.elapsed !== "number" || body.elapsed < 2000) return Response.json({ ok: true });

  const name = str(body.name, 100);
  const email = str(body.email, 200).toLowerCase();
  const country = str(body.country, 100);
  const role = str(body.role, 60);
  const resource = str(body.resource, 80);
  const interests = Array.isArray(body.interests)
    ? body.interests.filter((i): i is string => typeof i === "string" && (leadInterests as readonly string[]).includes(i))
    : [];

  if (name.length < 2) return Response.json({ ok: false, error: "name" }, { status: 400 });
  if (!EMAIL_RE.test(email)) return Response.json({ ok: false, error: "email" }, { status: 400 });
  if (body.consent !== true) return Response.json({ ok: false, error: "consent" }, { status: 400 });
  if (role && !(leadRoles as readonly string[]).includes(role)) {
    return Response.json({ ok: false, error: "role" }, { status: 400 });
  }

  const payload = {
    secret: process.env.LEADS_WEBHOOK_SECRET ?? "",
    timestamp: new Date().toISOString(),
    name,
    email,
    country,
    // Coarse country from the hosting provider's edge (only set when deployed on Vercel).
    ipCountry: request.headers.get("x-vercel-ip-country") ?? "",
    role,
    interests: interests.join(", "),
    resource,
    consent: true,
    consentText: leadConsentText,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const text = await res.text();
    let ok = false;
    try {
      ok = JSON.parse(text).ok === true;
    } catch {
      ok = false;
    }
    if (!res.ok || !ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error("[leads] failed to store lead:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: "store_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
