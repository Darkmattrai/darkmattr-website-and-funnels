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

/** "@handle", "instagram.com/handle/" and "handle" all become "handle". */
export function normalizeInstagram(v: string): string {
  const s = v.trim().replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/^@/, "").replace(/[/?].*$/, "");
  return s.slice(0, 60);
}
