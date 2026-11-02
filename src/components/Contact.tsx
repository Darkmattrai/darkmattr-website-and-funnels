"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { contact, site } from "@/content/site";
import { RevealText, SectionLabel } from "./Reveal";

type Data = {
  services: string[];
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
  website: string;
  message: string;
  fax: string; // honeypot
};

const empty: Data = { services: [], budget: "", timeline: "", name: "", email: "", company: "", website: "", message: "", fax: "" };
const STEPS = ["What you need", "Scale & timing", "About you"];

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-5 py-3 text-[0.95rem] transition-all duration-300 ${
        selected ? "border-flare bg-flare text-void" : "border-line hover:border-bone/40"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="group block">
      <span className="label">
        {label}
        {required && <span className="text-flare"> *</span>}
      </span>
      <input
        required={required}
        {...props}
        className="mt-2 w-full border-b border-line bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-bone/25 focus:border-flare"
      />
    </label>
  );
}

export function Contact() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(empty);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setData((d) => ({ ...d, [k]: v }));
  const toggleService = (s: string) =>
    set("services", data.services.includes(s) ? data.services.filter((x) => x !== s) : [...data.services, s]);

  const canNext = step === 0 ? data.services.length > 0 : step === 1 ? Boolean(data.budget && data.timeline) : true;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      if (canNext) setStep(step + 1);
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: typeof window !== "undefined" ? window.location.href : "" }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="pointer-events-none absolute -bottom-1/3 left-1/2 size-[90vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,91,46,0.16),rgba(139,92,255,0.08)_35%,transparent_60%)]" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionLabel>{contact.label}</SectionLabel>
          <RevealText
            as="h2"
            text={contact.title}
            className="display mt-8 text-[clamp(3rem,8vw,8rem)]"
            accent={["orbit."]}
          />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/65">{contact.sub}</p>

          <ol className="mt-12 space-y-5">
            {["We reply within one business day", "30-minute strategy call: free, no pitch deck", "A written plan with real numbers, yours to keep"].map(
              (t, i) => (
                <li key={t} className="flex items-center gap-4 text-bone/80">
                  <span className="label grid size-9 shrink-0 place-items-center rounded-full border border-line">0{i + 1}</span>
                  {t}
                </li>
              ),
            )}
          </ol>

          <p className="mt-12 text-bone/60">
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="border-b border-bone/30 text-bone hover:border-flare">
              {site.email}
            </a>
          </p>
        </div>

        <div className="rounded-[2rem] border border-line bg-void/70 p-6 backdrop-blur-md sm:p-8 md:p-12">
          {status === "done" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-[420px] flex-col items-start justify-center"
            >
              <span className="grid size-16 place-items-center rounded-full bg-flare text-2xl text-void">✓</span>
              <h3 className="display mt-8 text-5xl">You&rsquo;re in orbit.</h3>
              <p className="mt-4 max-w-sm text-lg text-bone/70">{contact.success}</p>
            </motion.div>
          ) : (
            <form onSubmit={submit} noValidate={step < 2}>
              {/* progress */}
              <div className="flex items-center justify-between">
                <span className="label">
                  Step {step + 1} / {STEPS.length} · {STEPS[step]}
                </span>
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="label hover:!text-bone">
                    ← Back
                  </button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {STEPS.map((s, i) => (
                  <span key={s} className="h-0.5 overflow-hidden rounded-full bg-line">
                    <span
                      className="block h-full bg-flare transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ transform: `scaleX(${i <= step ? 1 : 0})`, transformOrigin: "left" }}
                    />
                  </span>
                ))}
              </div>

              <div className="relative mt-10 min-h-[330px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {step === 0 && (
                      <fieldset>
                        <legend className="text-2xl font-medium tracking-tight md:text-3xl">What should we build for you?</legend>
                        <p className="mt-2 text-bone/50">Pick as many as you like.</p>
                        <div className="mt-8 flex flex-wrap gap-2.5">
                          {contact.services.map((s) => (
                            <Chip key={s} selected={data.services.includes(s)} onClick={() => toggleService(s)}>
                              {s}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                    )}
                    {step === 1 && (
                      <div className="space-y-10">
                        <fieldset>
                          <legend className="text-2xl font-medium tracking-tight md:text-3xl">Monthly marketing budget?</legend>
                          <div className="mt-6 flex flex-wrap gap-2.5">
                            {contact.budgets.map((b) => (
                              <Chip key={b} selected={data.budget === b} onClick={() => set("budget", b)}>
                                {b}
                              </Chip>
                            ))}
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend className="text-2xl font-medium tracking-tight md:text-3xl">When do you want to start?</legend>
                          <div className="mt-6 flex flex-wrap gap-2.5">
                            {contact.timelines.map((t) => (
                              <Chip key={t} selected={data.timeline === t} onClick={() => set("timeline", t)}>
                                {t}
                              </Chip>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="grid gap-7 sm:grid-cols-2">
                        <Field label="Your name" required autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} />
                        <Field label="Email" type="email" required autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
                        <Field label="Company" autoComplete="organization" value={data.company} onChange={(e) => set("company", e.target.value)} />
                        <Field label="Website" type="url" placeholder="https://" autoComplete="url" value={data.website} onChange={(e) => set("website", e.target.value)} />
                        <label className="block sm:col-span-2">
                          <span className="label">Where are you now, and where do you want to be?</span>
                          <textarea
                            rows={3}
                            value={data.message}
                            onChange={(e) => set("message", e.target.value)}
                            className="mt-2 w-full resize-none border-b border-line bg-transparent py-3 text-lg outline-none transition-colors focus:border-flare"
                          />
                        </label>
                        {/* honeypot */}
                        <input
                          type="text"
                          name="fax"
                          tabIndex={-1}
                          autoComplete="off"
                          value={data.fax}
                          onChange={(e) => set("fax", e.target.value)}
                          className="absolute -left-[9999px] h-0 w-0 opacity-0"
                          aria-hidden
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {status === "error" && (
                <p role="alert" className="mb-4 rounded-xl border border-flare/40 bg-flare/10 p-4 text-sm">
                  {error} You can also email us directly at{" "}
                  <a className="underline" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={!canNext || status === "sending"}
                data-cursor={step === 2 ? "Launch" : "Next"}
                className="group flex w-full items-center justify-between rounded-full bg-bone py-3 pl-7 pr-3 text-lg font-medium text-void transition-all hover:bg-flare disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-bone"
              >
                {status === "sending" ? "Transmitting…" : step === 2 ? "Send it into orbit" : "Continue"}
                <span className="grid size-11 place-items-center rounded-full bg-void text-bone transition-transform duration-500 group-hover:rotate-[-45deg]">
                  →
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
