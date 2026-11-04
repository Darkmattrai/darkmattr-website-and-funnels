"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import trophy from "@/assets/clay/trophy.webp";
import { useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent } from "react";
import { MAX_ANSWER_CHARS, confirmStep, questions, success, type Question } from "@/content/hiring";
import { site } from "@/content/site";
import { formatPhone, type PhoneResult } from "@/lib/phone";
import { EMAIL_RE } from "@/lib/webhook";
import { ApplyStepOne, Field, INSTAGRAM_RE } from "./ApplyStepOne";
import { PhoneField } from "./PhoneField";
import { clearApplication, loadAnswers, loadApplicant, saveAnswers, saveApplicant, type Applicant } from "./applicant";

const ease = [0.16, 1, 0.3, 1] as const;
const subscribeNoop = () => () => {};
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

const titleCls = "text-[1.45rem] font-extrabold leading-snug outline-none md:text-[1.7rem]";

export function Survey() {
  const mounted = useMounted();
  if (!mounted) return <div className="min-h-[420px]" aria-busy />;
  return <SurveyInner />;
}

function SurveyInner() {
  const [applicant, setApplicant] = useState<Applicant | null>(() => loadApplicant());

  if (!applicant) {
    return (
      <div>
        <p className="mb-6 font-semibold text-bone/85">We couldn&rsquo;t find your details from step one. Start here, it takes a minute.</p>
        <ApplyStepOne compact onComplete={setApplicant} />
      </div>
    );
  }
  return <Steps applicant={applicant} onApplicantChange={setApplicant} />;
}

function Steps({ applicant, onApplicantChange }: { applicant: Applicant; onApplicantChange: (a: Applicant) => void }) {
  const total = questions.length;
  const [answers, setAnswers] = useState<Record<string, string>>(() => loadAnswers());
  const [index, setIndex] = useState(() => {
    // resume where they left off
    const saved = loadAnswers();
    const firstUnanswered = questions.findIndex((q) => q.kind !== "file" && !(saved[q.id] ?? "").trim());
    return firstUnanswered === -1 ? questions.length - 1 : firstUnanswered;
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [direction, setDirection] = useState(1);
  const [confirmReady, setConfirmReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLElement | null>(null);

  // confirmation (sticky contact) fields, prefilled from step one.
  // Rebuilt from E.164 so the number is unambiguous whatever was typed in step one.
  const [firstName, setFirstName] = useState(applicant.firstName);
  const [email, setEmail] = useState(applicant.email);
  const [instagram, setInstagram] = useState(applicant.instagram);
  const [phone, setPhone] = useState<PhoneResult>(() => formatPhone(applicant.phone.e164 ?? applicant.phone.text, applicant.phone.country));
  const [fax, setFax] = useState(""); // honeypot

  const atConfirm = index === total;
  const q: Question | undefined = questions[index];

  const setAnswer = (id: string, v: string) => {
    const next = { ...answers, [id]: v };
    setAnswers(next);
    saveAnswers(next);
  };

  const canContinue = (() => {
    if (!q) return true;
    if (q.kind === "file") return Boolean(file) && !fileError;
    return (answers[q.id] ?? "").trim().length > 0;
  })();

  const confirmValid =
    phone.valid && Boolean(file) && firstName.trim().length >= 2 && EMAIL_RE.test(email.trim()) && INSTAGRAM_RE.test(instagram.trim());

  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setConfirmReady(false);
    setIndex((i) => Math.max(0, Math.min(total, i + dir)));
  };

  const pickFile = (f: File | null, spec: Extract<Question, { kind: "file" }>) => {
    setFileError("");
    if (!f) return setFile(null);
    const okType = /\.(pdf|docx?)$/i.test(f.name);
    if (!okType) return setFileError("Please upload a PDF or Word document.");
    if (f.size > spec.maxMB * 1024 * 1024) return setFileError(`That file is over ${spec.maxMB} MB.`);
    setFile(f);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!atConfirm || !confirmReady || status === "sending" || !confirmValid || !file) return;
    setStatus("sending");
    setError("");
    const confirmed: Applicant = { ...applicant, firstName: firstName.trim(), email: email.trim(), instagram: instagram.trim(), phone };
    saveApplicant(confirmed);
    onApplicantChange(confirmed);
    const fd = new FormData();
    fd.set("firstName", confirmed.firstName);
    fd.set("email", confirmed.email);
    fd.set("phone", phone.e164 ?? "");
    fd.set("phoneText", phone.text);
    fd.set("country", phone.country);
    fd.set("instagram", confirmed.instagram);
    fd.set("source", applicant.source);
    fd.set("utm", JSON.stringify(applicant.utm));
    fd.set("stepOneAt", applicant.stepOneAt);
    fd.set("answers", JSON.stringify(answers));
    fd.set("fax", fax);
    fd.set("resume", file);
    try {
      const res = await fetch("/api/apply/step2", { method: "POST", body: fd });
      if (res.status === 413) throw new Error("Your resume is too large. Please upload a file under 4 MB.");
      if (res.status === 429) throw new Error("Too many attempts. Please try again in a minute.");
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      clearApplication();
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const liveText = atConfirm ? `Last step. ${confirmStep.title}` : `Question ${index + 1} of ${total}. ${q?.title ?? ""}`;

  if (status === "done") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <Image src={trophy} alt="" sizes="200px" className="clay-bob h-36 w-auto" />
        <h2 className="clay-type mt-6 text-[2.6rem] outline-none md:text-[3.2rem]" tabIndex={-1} ref={(el) => el?.focus()}>
          {success.title}
        </h2>
        <p className="mt-4 max-w-md text-lg font-medium text-bone/85">{success.body}</p>
        <a href={site.url} className="clay-btn clay-btn-light mt-8">
          Back to Dark Mattr
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <p className="sr-only" aria-live="polite">
        {liveText}
      </p>
      {/* progress */}
      <div className="flex items-center justify-between">
        <span id="apply-progress-label" className="text-sm font-extrabold uppercase tracking-[0.12em] text-[#b4510a]">
          {atConfirm ? "Last step · Confirm your details" : `Question ${index + 1} of ${total}`}
        </span>
        {index > 0 && (
          <button type="button" onClick={() => go(-1)} className="-m-3.5 p-3.5 text-sm font-bold text-bone/80 underline-offset-4 hover:underline">
            ← Back
          </button>
        )}
      </div>
      <div
        className="mt-4 h-3.5 overflow-hidden rounded-full bg-[#efe3cf] shadow-[inset_0_2px_4px_rgba(42,31,61,0.18)]"
        role="progressbar"
        aria-labelledby="apply-progress-label"
        aria-valuemin={0}
        aria-valuemax={total + 1}
        aria-valuenow={index + 1}
        aria-valuetext={atConfirm ? "Last step: confirm your details" : `Question ${index + 1} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-[radial-gradient(120%_160%_at_30%_10%,#ffb36b_0%,#ff8b2b_50%,#c9611a_140%)] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)] transition-transform duration-500 ease-[steps(5)]"
          style={{ transform: `scaleX(${(index + 1) / (total + 1)})`, transformOrigin: "left" }}
        />
      </div>

      <div className="relative mt-10 min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 * direction }}
            transition={{ duration: 0.45, ease }}
            onAnimationComplete={(def) => {
              if (def === "exit") return;
              if (index === total) setConfirmReady(true);
              if (q?.kind !== "text") headingRef.current?.focus();
            }}
          >
            {q && q.kind === "choice" && (
              <fieldset>
                <legend ref={(el) => void (headingRef.current = el)} tabIndex={-1} className={titleCls}>
                  {q.title}
                </legend>
                <div className="mt-8 grid gap-4">
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === opt;
                    return (
                      <label
                        key={opt}
                        className={`clay-card flex cursor-pointer items-center gap-4 px-5 py-4 text-lg font-bold transition-transform has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum ${
                          selected ? "-rotate-1 ring-[3px] ring-tangerine" : "hover:-translate-y-0.5"
                        }`}
                      >
                        <input type="radio" name={q.id} value={opt} checked={selected} onChange={() => setAnswer(q.id, opt)} className="sr-only" />
                        <span className={`clay-ball ${selected ? "" : "clay-ball-sun"} size-10 shrink-0 text-xl`}>
                          {i + 1}
                        </span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {q && q.kind === "text" && (
              <TextQuestion q={q} value={answers[q.id] ?? ""} onChange={(v) => setAnswer(q.id, v)} onEnter={() => canContinue && go(1)} />
            )}

            {q && q.kind === "file" && (
              <div>
                <h2 ref={(el) => void (headingRef.current = el)} tabIndex={-1} className={titleCls}>
                  {q.title}
                </h2>
                {q.help && <p className="mt-2 font-medium text-bone/80">{q.help}</p>}
                <label
                  className={`mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[28px] border-[3px] border-dashed px-6 py-12 text-center transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum ${
                    file ? "border-tangerine bg-[#fff1e2]" : "border-[#d9c8ad] bg-[#fffaf1] hover:border-[#c4b090]"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    pickFile(e.dataTransfer.files?.[0] ?? null, q);
                  }}
                >
                  <input type="file" accept={q.accept} className="sr-only" onChange={(e) => pickFile(e.target.files?.[0] ?? null, q)} />
                  <span className="clay-ball clay-ball-sun size-14 text-2xl">↑</span>
                  {file ? (
                    <span className="text-lg font-bold">
                      {file.name} <span className="font-medium text-bone/75">· {(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </span>
                  ) : (
                    <span className="text-lg">
                      Drop your resume here or <span className="font-bold underline underline-offset-4">browse</span>
                    </span>
                  )}
                </label>
                {fileError && (
                  <p role="alert" className="mt-3 text-sm font-semibold text-danger">
                    {fileError}
                  </p>
                )}
              </div>
            )}

            {atConfirm && (
              <div>
                <h2 ref={(el) => void (headingRef.current = el)} tabIndex={-1} className={titleCls}>
                  {confirmStep.title}
                </h2>
                <p className="mt-2 font-medium text-bone/85">{confirmStep.sub}</p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <Field label="First name" required autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={firstName.trim().length >= 2 ? undefined : "Please add your first name."} />
                  <Field label="Email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={EMAIL_RE.test(email.trim()) ? undefined : "Please add a valid email address."} />
                  <div className="sm:col-span-2">
                    <PhoneField value={phone} onChange={setPhone} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Instagram account" required autoCapitalize="none" value={instagram} onChange={(e) => setInstagram(e.target.value)} error={INSTAGRAM_RE.test(instagram.trim()) ? undefined : "Please add your Instagram handle."} />
                  </div>
                  <input type="text" name="fax" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
                </div>
                <p className="mt-6 text-xs font-semibold text-bone/75">{confirmStep.retention}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-2xl border-2 border-danger/40 bg-danger/10 p-4 text-sm font-semibold">
          {error}
        </p>
      )}

      <div className="mt-8">
        {atConfirm ? (
          <button key="submit" type="submit" disabled={status === "sending" || !confirmValid || !confirmReady} className="clay-btn w-full">
            {status === "sending" ? "Sending…" : confirmStep.button}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <button key="next" type="button" onClick={() => go(1)} disabled={!canContinue} className="clay-btn w-full">
            {index === total - 1 ? "Review My Details" : "Continue"}
            <span aria-hidden>→</span>
          </button>
        )}
        {!atConfirm && q?.kind === "text" && (
          <p className="mt-4 text-center text-xs font-semibold text-bone/75">{q.multiline ? "Ctrl + Enter to continue" : "Enter to continue"}</p>
        )}
      </div>
    </form>
  );
}

function TextQuestion({
  q,
  value,
  onChange,
  onEnter,
}: {
  q: Extract<Question, { kind: "text" }>;
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
}) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (q.multiline && !(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    onEnter();
  };
  return (
    <div>
      <label htmlFor={q.id} className={`block ${titleCls}`}>
        {q.title}
      </label>
      {q.help && (
        <p id={`${q.id}-help`} className="mt-2 font-medium text-bone/80">
          {q.help}
        </p>
      )}
      <div className="clay-field mt-6">
        {q.multiline ? (
          <textarea
            id={q.id}
            rows={4}
            autoFocus
            maxLength={MAX_ANSWER_CHARS}
            data-lenis-prevent
            aria-describedby={q.help ? `${q.id}-help` : undefined}
            value={value}
            placeholder={q.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKey}
            className="clay-control min-h-36 [field-sizing:content]"
          />
        ) : (
          <input
            id={q.id}
            type="text"
            autoFocus
            maxLength={MAX_ANSWER_CHARS}
            aria-describedby={q.help ? `${q.id}-help` : undefined}
            value={value}
            placeholder={q.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKey}
            className="clay-control"
          />
        )}
      </div>
    </div>
  );
}
