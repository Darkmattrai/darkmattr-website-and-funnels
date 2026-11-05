import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { MAX_ANSWER_CHARS, MAX_RESUME_MB, normalizeLoomUrl, questions, roles } from "@/content/hiring";
import { normalizePhone } from "@/lib/phone";
import { APPLICANT_TAGS, EMAIL_RE, forwardToWebhook, normalizeInstagram, parseObject, sanitizeUtm, str } from "@/lib/webhook";

// Vercel rejects request bodies over 4.5 MB before the function runs; 4 MB leaves headroom.
const MAX_RESUME_BYTES = MAX_RESUME_MB * 1024 * 1024;
const RESUME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ROLE_TAG = Object.fromEntries(roles.map((r) => [r.title, `role-${r.id}`]));

/**
 * Step 2 of the Selling System application: the survey answers, the confirmed
 * contact details and the resume. Forwards to SALES_APPLY_STEP2_WEBHOOK_URL.
 *
 * The resume is stored in Vercel Blob (BLOB_READ_WRITE_TOKEN) and sent as a URL;
 * /api/cron/purge-resumes deletes stored resumes after the retention window.
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
    if (q.kind === "file") continue;
    const v = str(raw[q.id], MAX_ANSWER_CHARS);
    if (!v) return NextResponse.json({ error: `Please answer: ${q.title}` }, { status: 422 });
    if (q.kind === "choice" && !q.options.includes(v)) return NextResponse.json({ error: `Please pick one of the options for: ${q.title}` }, { status: 422 });
    if (q.kind === "text" && q.format === "loom") {
      const url = normalizeLoomUrl(v);
      if (!url) return NextResponse.json({ error: q.formatError || "Please add a valid Loom link." }, { status: 422 });
      answers[q.id] = url;
      continue;
    }
    answers[q.id] = v;
  }

  const resume = fd.get("resume");
  if (!(resume instanceof File) || resume.size === 0) return NextResponse.json({ error: "Please upload your resume." }, { status: 422 });
  if (resume.size > MAX_RESUME_BYTES) return NextResponse.json({ error: `Your resume is over ${MAX_RESUME_MB} MB.` }, { status: 422 });
  const extOk = /\.(pdf|docx?)$/i.test(resume.name);
  if (!extOk && !RESUME_TYPES.has(resume.type)) return NextResponse.json({ error: "Please upload a PDF or Word document." }, { status: 422 });

  // Resume storage
  let resumeUrl = "";
  let resumeBase64 = "";
  const ext = (resume.name.match(/\.(pdf|docx?)$/i)?.[1] ?? "pdf").toLowerCase();
  const safeName = resume.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "resume";
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`selling-system/resumes/${Date.now()}-${safeName}.${ext}`, resume, {
        access: "public",
        addRandomSuffix: true,
        contentType: RESUME_TYPES.has(resume.type) ? resume.type : "application/octet-stream",
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
    loomUrl: answers.loomUrl,
    resumeUrl,
    resumeFileName: resume.name.slice(0, 120),
    resumeMimeType: resume.type,
    ...(resumeBase64 ? { resumeBase64 } : {}),
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
    console.info("[apply/step2] (dev, no webhook configured)", { ...payload, resumeBase64: resumeBase64 ? `${resumeBase64.length} chars` : "" });
    return NextResponse.json({ ok: true });
  }

  const ok = await forwardToWebhook(webhook, payload, 20_000);
  if (!ok) return NextResponse.json({ error: "We couldn't send your application just now. Please try again." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
