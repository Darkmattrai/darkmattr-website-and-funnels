import { NextResponse } from "next/server";

type Lead = {
  services?: unknown;
  budget?: unknown;
  timeline?: unknown;
  name?: unknown;
  email?: unknown;
  company?: unknown;
  website?: unknown;
  message?: unknown;
  source?: unknown;
  fax?: unknown;
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Lead;
  try {
    body = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, drop the lead.
  if (str(body.fax)) return NextResponse.json({ ok: true });

  const lead = {
    name: str(body.name, 120),
    email: str(body.email, 200),
    company: str(body.company, 200),
    website: str(body.website, 300),
    services: Array.isArray(body.services) ? body.services.map((s) => str(s, 60)).filter(Boolean).slice(0, 10) : [],
    budget: str(body.budget, 60),
    timeline: str(body.timeline, 60),
    message: str(body.message, 4000),
    source: str(body.source, 500),
    submittedAt: new Date().toISOString(),
  };

  if (!lead.name || !EMAIL.test(lead.email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 422 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[lead] LEAD_WEBHOOK_URL is not set; lead could not be delivered.", lead.email);
      return NextResponse.json({ error: "Our form is temporarily offline." }, { status: 503 });
    }
    console.info("[lead] (dev, no webhook configured)", lead);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("[lead] delivery failed", err);
    return NextResponse.json({ error: "We couldn't send that just now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
