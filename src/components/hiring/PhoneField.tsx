"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { countries, countriesByCode, formatPhone, type CountryCode, type PhoneResult } from "@/lib/phone";

const subscribeNoop = () => () => {};
const useMounted = () => useSyncExternalStore(subscribeNoop, () => true, () => false);

const digits = (s: string) => s.replace(/\D/g, "");

/**
 * Phone input that formats as you type and resolves the country code automatically:
 * a visitor in Lebanon typing "71097342" is stored as +961 71 097 342.
 * Typing a leading "+" switches to that number's country.
 */
export function PhoneField({
  value,
  onChange,
  required = true,
  label = "Phone number",
  error,
}: {
  value: PhoneResult;
  onChange: (next: PhoneResult) => void;
  required?: boolean;
  label?: string;
  error?: string;
}) {
  const id = useId();
  const mounted = useMounted();
  const [touched, setTouched] = useState(false);
  const invalid = Boolean(error) || (touched && value.text.length > 0 && !value.valid);
  const current = countries.find((c) => c.code === value.country);

  const handleText = (raw: string) => {
    // Re-format only when digits were added; deleting keeps the caret sane.
    const grew = digits(raw).length > digits(value.text).length || raw.startsWith("+");
    const next = formatPhone(raw, value.country);
    onChange(grew ? next : { ...next, text: raw });
  };

  const handleCountry = (code: CountryCode) => {
    // Keep the national part of whatever was typed; an international number keeps its digits.
    const national = value.text.startsWith("+") ? (value.national ?? digits(value.text)) : value.text;
    onChange(formatPhone(national, code));
  };

  const hint = error
    ? error
    : value.valid && value.international
      ? `Saved as ${value.international}`
      : invalid
        ? `That doesn't look like a valid number for ${current?.name ?? value.country}. Type it with a + if it's from another country.`
        : `Type your local number for ${current?.name ?? value.country}; we add the country code.`;

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-flare"> *</span>}
      </label>
      <div className={`mt-2 flex items-end gap-3 border-b transition-colors focus-within:border-flare ${invalid ? "border-flare/60" : "border-line"}`}>
        {/* Visible: "LB +961". The real select (with full country names) sits on top, transparent. */}
        <div className="relative w-[7.5rem] shrink-0">
          <span aria-hidden className="flex items-center gap-1 py-3 text-base text-bone">
            {value.country} +{current?.callingCode}
            <svg viewBox="0 0 12 12" className="ml-auto size-3 text-bone/60" aria-hidden>
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <select
            aria-label="Country"
            value={value.country}
            onChange={(e) => handleCountry(e.target.value as CountryCode)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            {(mounted ? countries : countriesByCode).map((c) => (
              <option key={c.code} value={c.code}>
                {mounted ? `${c.name} (+${c.callingCode})` : `${c.code} (+${c.callingCode})`}
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required={required}
          value={value.text}
          onChange={(e) => handleText(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={value.country === "LB" ? "71 097 342" : "Your number"}
          aria-invalid={invalid}
          aria-describedby={`${id}-hint`}
          className="w-full bg-transparent py-3 text-lg outline-none placeholder:text-bone/50"
        />
      </div>
      <p id={`${id}-hint`} className={`mt-2 text-xs ${invalid ? "text-flare" : "text-bone/60"}`} aria-live="polite">
        {hint}
      </p>
    </div>
  );
}
