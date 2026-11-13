import { NextResponse } from "next/server";
import { MAX_ANSWER_CHARS, questions, roles } from "@/content/hiring";
import { normalizePhone } from "@/lib/phone";
import { APPLICANT_TAGS, EMAIL_RE, forwardToWebhook, normalizeInstagram, parseObject, sanitizeUtm, str } from "@/lib/webhook";

const ROLE_TAG = Object.fromEntries(roles.map((r) => [r.title, `role-${r.id}`]));

/**
 * Step 2 of the Selling System application: the survey answers and the confirmed
 * contact details. Forwards to SALES_APPLY_STEP2_WEBHOOK_URL.
 * The application no longer asks for a Loom video or a resume; any extra fields are ignored.
 */
export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const get = (k: string, max = 500) => str(fd.get(k), max);
  if (get("fax")) return NextResponse.json({ ok: true }); // honeypot

  const firstName = get("firstName", 80);
  const email = get("email", 200).toLowerCase();
  const phone = normalizePhone(get("phone", 40) || get("phoneText", 40), get("country", 2));
  const instagram = normalizeInstagram(get("instagram", 120));
  if (firstName.length < 2) return NextResponse.json({ error: "Please confirm your first name." }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please confirm a valid email." }, { status: 422 });
  if (!phone) return NextResponse.json({ error: "Please confirm a valid phone number." }, { status: 422 });
  if (!instagram) return NextResponse.json({ error: "Please confirm your Instagram account." }, { status: 422 });

  // answers, keyed by question id, validated in question order
  const raw = parseObject(get("answers", 80_000));
  const answers: Record<string, string> = {};
  for (const q of questions) {
    const v = str(raw[q.id], MAX_ANSWER_CHARS);
    if (!v) return NextResponse.json({ error: `Please answer: ${q.title}` }, { status: 422 });
    if (q.kind === "choice" && !q.options.includes(v)) return NextResponse.json({ error: `Please pick one of the options for: ${q.title}` }, { status: 422 });
    answers[q.id] = v;
  }

  const payload = {
    step: "step2",
    funnel: "selling-system-hiring",
    firstName,
    email,
    phone: phone.e164,
    phoneFormatted: phone.international,
    phoneCountry: phone.country,
    instagram,
    instagramUrl: `https://instagram.com/${instagram}`,
    position: answers.position,
    experience: answers.experience,
    training: answers.training,
    objection: answers.objection,
    closingRate: answers.closingRate,
    characteristics: answers.characteristics,
    bestOffer: answers.bestOffer,
    source: get("source", 500),
    utm: sanitizeUtm(parseObject(get("utm", 4000))),
    stepOneAt: get("stepOneAt", 40),
    tags: [...APPLICANT_TAGS, "step-2", ROLE_TAG[answers.position] ?? "role-unknown"],
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.SALES_APPLY_STEP2_WEBHOOK_URL || process.env.SALES_APPLY_STEP1_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[apply/step2] neither SALES_APPLY_STEP2_WEBHOOK_URL nor SALES_APPLY_STEP1_WEBHOOK_URL is set");
      return NextResponse.json({ error: "Applications are temporarily offline. Please try again shortly." }, { status: 503 });
    }
    console.info("[apply/step2] (dev, no webhook configured)", payload);
    return NextResponse.json({ ok: true });
  }

  const ok = await forwardToWebhook(webhook, payload, 20_000);
  if (!ok) return NextResponse.json({ error: "We couldn't send your application just now. Please try again." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
