"use client";

import { AnimatePresence, motion } from "motion/react";
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

const titleCls = "text-2xl font-bold leading-snug outline-none md:text-[1.75rem]";

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
        <p className="mb-6 text-bone/75">We couldn&rsquo;t find your details from step one. Start here, it takes a minute.</p>
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
        <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-flare to-plasma text-2xl font-extrabold text-void">✓</span>
        <h2 className="display mt-8 text-4xl outline-none md:text-5xl" tabIndex={-1} ref={(el) => el?.focus()}>
          {success.title}
        </h2>
        <p className="mt-4 max-w-md text-lg text-bone/80">{success.body}</p>
        <a href={site.url} className="dm-btn-dark mt-8">
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
        <span id="apply-progress-label" className="dm-eyebrow">
          {atConfirm ? "Last step · Confirm your details" : `Question ${index + 1} of ${total}`}
        </span>
        {index > 0 && (
          <button type="button" onClick={() => go(-1)} className="-m-3.5 p-3.5 text-sm font-semibold text-bone/70 transition-colors hover:text-flare">
            ← Back
          </button>
        )}
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-black/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.6)]"
        role="progressbar"
        aria-labelledby="apply-progress-label"
        aria-valuemin={0}
        aria-valuemax={total + 1}
        aria-valuenow={index + 1}
        aria-valuetext={atConfirm ? "Last step: confirm your details" : `Question ${index + 1} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-flare to-plasma transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
                        className={`dm-raised flex cursor-pointer items-center gap-4 rounded-2xl px-5 py-4 text-lg font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-flare ${
                          selected ? "!border-flare/80 text-flare" : "hover:!border-white/20"
                        }`}
                      >
                        <input type="radio" name={q.id} value={opt} checked={selected} onChange={() => setAnswer(q.id, opt)} className="sr-only" />
                        <span
                          className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
                            selected ? "bg-gradient-to-br from-flare to-plasma text-void" : "border border-line text-bone/80"
                          }`}
                        >
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
                {q.help && <p className="mt-2 text-bone/70">{q.help}</p>}
                <label
                  className={`mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-flare ${
                    file ? "border-flare/70 bg-flare/5" : "border-white/20 hover:border-white/40"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    pickFile(e.dataTransfer.files?.[0] ?? null, q);
                  }}
                >
                  <input type="file" accept={q.accept} className="sr-only" onChange={(e) => pickFile(e.target.files?.[0] ?? null, q)} />
                  <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-flare to-plasma text-xl font-extrabold text-void">↑</span>
                  {file ? (
                    <span className="text-lg font-semibold">
                      {file.name} <span className="font-normal text-bone/70">· {(file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </span>
                  ) : (
                    <span className="text-lg">
                      Drop your resume here or <span className="font-semibold text-flare underline underline-offset-4">browse</span>
                    </span>
                  )}
                </label>
                {fileError && (
                  <p role="alert" className="mt-3 text-sm text-danger">
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
                <p className="mt-2 text-bone/75">{confirmStep.sub}</p>
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
                <p className="mt-6 text-xs text-bone/60">{confirmStep.retention}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm">
          {error}
        </p>
      )}

      <div className="mt-8">
        {atConfirm ? (
          <button key="submit" type="submit" disabled={status === "sending" || !confirmValid || !confirmReady} className="dm-btn w-full text-lg">
            {status === "sending" ? "Sending…" : confirmStep.button}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <button key="next" type="button" onClick={() => go(1)} disabled={!canContinue} className="dm-btn w-full text-lg">
            {index === total - 1 ? "Review My Details" : "Continue"}
            <span aria-hidden>→</span>
          </button>
        )}
        {!atConfirm && q?.kind === "text" && (
          <p className="mt-3 text-center text-xs text-bone/60">{q.multiline ? "Ctrl + Enter to continue" : "Enter to continue"}</p>
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
        <p id={`${q.id}-help`} className="mt-2 text-bone/70">
          {q.help}
        </p>
      )}
      <div className="dm-field mt-6">
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
            className="dm-control min-h-36 [field-sizing:content]"
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
            className="dm-control"
          />
        )}
      </div>
    </div>
  );
}
