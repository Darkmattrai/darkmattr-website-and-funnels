"use client";

import type { PhoneResult } from "@/lib/phone";

/** The "sticky contact": what step one collected, kept for step two's confirmation. */
export type Applicant = {
  firstName: string;
  email: string;
  phone: PhoneResult;
  instagram: string;
  source: string;
  utm: Record<string, string>;
  stepOneAt: string;
};

const KEY = "ss-applicant";
const ANSWERS_KEY = "ss-answers";

export function loadApplicant(): Applicant | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Applicant) : null;
  } catch {
    return null;
  }
}

export function saveApplicant(a: Applicant) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {}
}

export function loadAnswers(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveAnswers(a: Record<string, string>) {
  try {
    sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(a));
  } catch {}
}

export function clearApplication() {
  try {
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(ANSWERS_KEY);
  } catch {}
}

/** utm_* and a few ad params from the current URL. */
export function readUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const [k, v] of params) {
      if (/^(utm_|fbclid|gclid|ttclid|ref$)/i.test(k)) out[k] = v.slice(0, 200);
    }
  } catch {}
  return out;
}
