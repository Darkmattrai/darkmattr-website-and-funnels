"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { stepOne } from "@/content/hiring";
import { detectCountry, formatPhone, type PhoneResult } from "@/lib/phone";
import { EMAIL_RE } from "@/lib/webhook";
import { PhoneField } from "./PhoneField";
import { readUtm, saveApplicant, type Applicant } from "./applicant";

const subscribeNoop = () => () => {};
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

export const INSTAGRAM_RE = /^@?[A-Za-z0-9._]{1,30}$/;

export function Field({
  label,
  required,
  hint,
  error,
  ...props
}: { label: string; required?: boolean; hint?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-flare"> *</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        {...props}
        className={`mt-2 w-full border-b bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-bone/50 focus:border-flare ${
          error ? "border-flare/60" : "border-line"
        }`}
      />
      {(error || hint) && (
        <p id={`${id}-msg`} role={error ? "alert" : undefined} className={`mt-2 text-xs ${error ? "text-flare" : "text-bone/60"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

type Errors = Partial<Record<"firstName" | "email" | "phone" | "instagram", string>>;

/**
 * Step 1 of the funnel: first name, email, phone, Instagram.
 * Posts to its own webhook, keeps the contact as the "sticky" profile for step 2.
 */
export function ApplyStepOne({
  nextHref = "/selling-system/apply",
  onComplete,
  compact = false,
  titleId,
}: {
  nextHref?: string;
  /** When given, called instead of navigating (used inside the survey page). */
  onComplete?: (applicant: Applicant) => void;
  compact?: boolean;
  /** id for the heading, so a dialog can point aria-labelledby at it. */
  titleId?: string;
}) {
  const router = useRouter();
  const mounted = useMounted();
  const formRef = useRef<HTMLFormElement>(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState<PhoneResult>(() => formatPhone("", "LB"));
  const [detected, setDetected] = useState(false);
  const [fax, setFax] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  // Detect the visitor's country once we're on the client (no setState inside an effect).
  if (mounted && !detected) {
    setDetected(true);
    setPhone(formatPhone("", detectCountry()));
  }

  const validate = (): Errors => {
    const e: Errors = {};
    if (firstName.trim().length < 2) e.firstName = "Please add your first name.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Please add a valid email address.";
    if (!phone.valid) e.phone = phone.text ? "Please check your phone number." : "Please add your phone number.";
    if (!INSTAGRAM_RE.test(instagram.trim().replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "").replace(/\/.*$/, "")))
      e.instagram = "Please add your Instagram handle, like @yourhandle.";
    return e;
  };

  const clear = (k: keyof Errors) => setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      // focus the first invalid field once the errors have rendered
      setTimeout(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
      return;
    }
    setStatus("sending");
    setError("");
    const applicant: Applicant = {
      firstName: firstName.trim(),
      email: email.trim(),
      phone,
      instagram: instagram.trim(),
      source: window.location.href,
      utm: readUtm(),
      stepOneAt: new Date().toISOString(),
    };
    try {
      const res = await fetch("/api/apply/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: applicant.firstName,
          email: applicant.email,
          phone: phone.e164,
          phoneText: phone.text,
          country: phone.country,
          instagram: applicant.instagram,
          source: applicant.source,
          utm: applicant.utm,
          fax,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || (res.status === 429 ? "Too many attempts. Please try again in a minute." : "Something went wrong."));
      saveApplicant(applicant);
      if (onComplete) {
        setStatus("idle");
        onComplete(applicant);
      } else {
        router.push(nextHref);
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className={compact ? "" : "rounded-[2rem] border border-line bg-void/70 p-6 backdrop-blur-md sm:p-8 md:p-10"}>
      <div className="mb-8">
        <p className="label">Step 1 of 2 · Your details</p>
        <h3 id={titleId} className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{stepOne.title}</h3>
        <p className="mt-2 text-bone/60">{stepOne.sub}</p>
      </div>
      <div className="relative grid gap-7 sm:grid-cols-2">
        <Field
          label="First name"
          required
          autoComplete="given-name"
          value={firstName}
          error={errors.firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            clear("firstName");
          }}
        />
        <Field
          label="Email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            clear("email");
          }}
        />
        <div className="sm:col-span-2">
          <PhoneField
            value={phone}
            error={errors.phone}
            onChange={(p) => {
              setPhone(p);
              clear("phone");
            }}
          />
        </div>
        <div className="sm:col-span-2">
          <Field
            label="Instagram account"
            required
            autoComplete="off"
            autoCapitalize="none"
            placeholder="@yourhandle"
            value={instagram}
            error={errors.instagram}
            onChange={(e) => {
              setInstagram(e.target.value);
              clear("instagram");
            }}
            hint="We check it. Make sure it's the one you'd message a client from."
          />
        </div>
        <input type="text" name="fax" tabIndex={-1} autoComplete="off" value={fax} onChange={(e) => setFax(e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-xl border border-flare/40 bg-flare/10 p-4 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-8 flex w-full items-center justify-between rounded-full bg-flare py-3 pl-7 pr-3 text-lg font-medium text-void transition-all hover:bg-bone disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sending" ? "Saving…" : stepOne.button}
        <span className="grid size-11 place-items-center rounded-full bg-void text-bone transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
      </button>
      <p className="mt-4 text-center text-xs text-bone/60">No spam. We only use this to get back to you about the role.</p>
    </form>
  );
}
