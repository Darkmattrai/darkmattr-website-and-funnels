/** Tags on every Selling System application payload, ahead of the step and role tags. */
export const APPLICANT_TAGS = ["lead", "sales applicant"];

/**
 * Forward a JSON payload to an inbound webhook (agenci.io / GoHighLevel, Zapier, Make…).
 * Returns true on 2xx. Never throws.
 */
export async function forwardToWebhook(url: string, payload: unknown, timeoutMs = 10_000): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) {
      console.error(`[webhook] ${new URL(url).host} responded ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[webhook] delivery failed", err);
    return false;
  }
}

export const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "@handle", "instagram.com/handle/" and "handle" all become "handle"; anything else becomes "". */
export function normalizeInstagram(v: string): string {
  const s = v
    .trim()
    .replace(/^(https?:\/\/)?(www\.|m\.)?instagram\.com\//i, "")
    .replace(/^@/, "")
    .replace(/[/?#].*$/, "");
  return /^[A-Za-z0-9._]{1,30}$/.test(s) ? s : "";
}

const UTM_KEY_RE = /^(utm_[a-z_]{1,30}|fbclid|gclid|ttclid|ref)$/i;

/** Keep only the ad parameters we expect, bounded in count and size. */
export function sanitizeUtm(u: unknown): Record<string, string> {
  if (!u || typeof u !== "object" || Array.isArray(u)) return {};
  return Object.fromEntries(
    Object.entries(u as Record<string, unknown>)
      .filter(([k]) => UTM_KEY_RE.test(k))
      .slice(0, 20)
      .map(([k, v]) => [k.toLowerCase(), str(v, 200)]),
  );
}

/** Parse attacker-controlled JSON into a plain object, or {}. */
export function parseObject(raw: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(raw || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {}
  return {};
}
