import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/phone";
import { EMAIL_RE, forwardToWebhook, normalizeInstagram, str } from "@/lib/webhook";

/**
 * Step 1 of the Selling System application: contact details.
 * Forwards to SALES_APPLY_STEP1_WEBHOOK_URL (agenci.io inbound webhook).
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (str(body.fax)) return NextResponse.json({ ok: true }); // honeypot

  const firstName = str(body.firstName, 80);
  const email = str(body.email, 200).toLowerCase();
  const phone = normalizePhone(str(body.phone, 40) || str(body.phoneText, 40), str(body.country, 2));
  const instagram = normalizeInstagram(str(body.instagram, 120));

  if (firstName.length < 2) return NextResponse.json({ error: "Please add your first name." }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please add a valid email." }, { status: 422 });
  if (!phone) return NextResponse.json({ error: "Please add a valid phone number." }, { status: 422 });
  if (!instagram) return NextResponse.json({ error: "Please add your Instagram account." }, { status: 422 });

  const utm = body.utm && typeof body.utm === "object" ? (body.utm as Record<string, unknown>) : {};
  const payload = {
    step: "step1",
    funnel: "selling-system-hiring",
    firstName,
    email,
    phone: phone.e164,
    phoneFormatted: phone.international,
    phoneCountry: phone.country,
    instagram,
    instagramUrl: `https://instagram.com/${instagram}`,
    source: str(body.source, 500),
    utm: Object.fromEntries(Object.entries(utm).map(([k, v]) => [k, str(v, 200)])),
    tags: ["selling-system-applicant", "step-1"],
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.SALES_APPLY_STEP1_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[apply/step1] SALES_APPLY_STEP1_WEBHOOK_URL is not set", email);
      return NextResponse.json({ error: "Applications are temporarily offline. Please try again shortly." }, { status: 503 });
    }
    console.info("[apply/step1] (dev, no webhook configured)", payload);
    return NextResponse.json({ ok: true, phone });
  }

  const ok = await forwardToWebhook(webhook, payload);
  if (!ok) return NextResponse.json({ error: "We couldn't save that just now. Please try again." }, { status: 502 });
  return NextResponse.json({ ok: true, phone });
}
