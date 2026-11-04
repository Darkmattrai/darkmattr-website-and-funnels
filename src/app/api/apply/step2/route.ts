import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { questions } from "@/content/hiring";
import { normalizePhone } from "@/lib/phone";
import { EMAIL_RE, forwardToWebhook, normalizeInstagram, str } from "@/lib/webhook";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

/**
 * Step 2 of the Selling System application: the survey answers, the confirmed
 * contact details and the resume. Forwards to SALES_APPLY_STEP2_WEBHOOK_URL.
 *
 * The resume is stored in Vercel Blob (BLOB_READ_WRITE_TOKEN) and sent as a URL.
 * Without a Blob token it is embedded base64 so nothing is lost before storage is set up.
 */
export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const get = (k: string, max = 500) => str(fd.get(k), max);

  const firstName = get("firstName", 80);
  const email = get("email", 200).toLowerCase();
  const phone = normalizePhone(get("phone", 40) || get("phoneText", 40), get("country", 2));
  const instagram = normalizeInstagram(get("instagram", 120));
  if (firstName.length < 2) return NextResponse.json({ error: "Please confirm your first name." }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Please confirm a valid email." }, { status: 422 });
  if (!phone) return NextResponse.json({ error: "Please confirm a valid phone number." }, { status: 422 });
  if (!instagram) return NextResponse.json({ error: "Please confirm your Instagram account." }, { status: 422 });

  // answers, keyed by question id, in question order
  let raw: Record<string, unknown> = {};
  try {
    raw = JSON.parse(get("answers", 20_000) || "{}") as Record<string, unknown>;
  } catch {}
  const answers: Record<string, string> = {};
  for (const q of questions) {
    if (q.kind === "file") continue;
    const v = str(raw[q.id], 4000);
    if (!v) return NextResponse.json({ error: `Please answer: ${q.title}` }, { status: 422 });
    answers[q.id] = v;
  }

  const resume = fd.get("resume");
  if (!(resume instanceof File) || resume.size === 0) return NextResponse.json({ error: "Please upload your resume." }, { status: 422 });
  if (resume.size > MAX_RESUME_BYTES) return NextResponse.json({ error: "Your resume is over 5 MB." }, { status: 422 });
  const extOk = /\.(pdf|docx?)$/i.test(resume.name);
  if (!extOk && !RESUME_TYPES.has(resume.type)) return NextResponse.json({ error: "Please upload a PDF or Word document." }, { status: 422 });

  let utm: Record<string, string> = {};
  try {
    const u = JSON.parse(get("utm", 2000) || "{}") as Record<string, unknown>;
    utm = Object.fromEntries(Object.entries(u).map(([k, v]) => [k, str(v, 200)]));
  } catch {}

  // Resume storage
  let resumeUrl = "";
  let resumeBase64 = "";
  const safeName = resume.name.replace(/[^\w.-]+/g, "-").slice(0, 80);
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`selling-system/resumes/${Date.now()}-${safeName}`, resume, {
        access: "public",
        addRandomSuffix: true,
        contentType: resume.type || "application/octet-stream",
      });
      resumeUrl = blob.url;
    } catch (err) {
      console.error("[apply/step2] resume upload failed", err);
      return NextResponse.json({ error: "We couldn't upload your resume. Please try again." }, { status: 502 });
    }
  } else {
    resumeBase64 = Buffer.from(await resume.arrayBuffer()).toString("base64");
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
    resumeUrl,
    resumeFileName: resume.name,
    resumeMimeType: resume.type,
    ...(resumeBase64 ? { resumeBase64 } : {}),
    source: get("source", 500),
    utm,
    stepOneAt: get("stepOneAt", 40),
    tags: ["selling-system-applicant", "step-2", `role-${answers.position.toLowerCase().replace(/[^a-z]+/g, "-")}`],
    submittedAt: new Date().toISOString(),
  };

  const webhook = process.env.SALES_APPLY_STEP2_WEBHOOK_URL || process.env.SALES_APPLY_STEP1_WEBHOOK_URL;
  if (!webhook) {
    if (process.env.NODE_ENV === "production") {
      console.error("[apply/step2] no webhook configured", email);
      return NextResponse.json({ error: "Applications are temporarily offline. Please try again shortly." }, { status: 503 });
    }
    console.info("[apply/step2] (dev, no webhook configured)", { ...payload, resumeBase64: resumeBase64 ? `${resumeBase64.length} chars` : "" });
    return NextResponse.json({ ok: true });
  }

  const ok = await forwardToWebhook(webhook, payload, 20_000);
  if (!ok) return NextResponse.json({ error: "We couldn't send your application just now. Please try again." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
