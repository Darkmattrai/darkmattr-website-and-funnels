"use client";

import { useId, useState } from "react";
import { countries, formatPhone, type CountryCode, type PhoneResult } from "@/lib/phone";

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
}: {
  value: PhoneResult;
  onChange: (next: PhoneResult) => void;
  required?: boolean;
  label?: string;
}) {
  const id = useId();
  const [touched, setTouched] = useState(false);
  const showError = touched && value.text.length > 0 && !value.valid;
  const current = countries.find((c) => c.code === value.country);

  const handleText = (raw: string) => {
    // Re-format only when digits were added; deleting keeps the caret sane.
    const grew = digits(raw).length > digits(value.text).length || raw.startsWith("+");
    const next = formatPhone(raw, value.country);
    onChange(grew ? next : { ...next, text: raw });
  };

  const handleCountry = (code: CountryCode) => {
    const national = value.text.startsWith("+") ? value.e164?.replace(/^\+\d+/, "") ?? "" : value.text;
    onChange(formatPhone(national, code));
  };

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span className="text-flare"> *</span>}
      </label>
      <div className="mt-2 flex items-end gap-3 border-b border-line transition-colors focus-within:border-flare">
        <select
          aria-label="Country"
          value={value.country}
          onChange={(e) => handleCountry(e.target.value as CountryCode)}
          className="w-[7.5rem] shrink-0 bg-transparent py-3 text-base text-bone outline-none"
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code} className="bg-ink text-bone">
              {c.code} +{c.callingCode}
            </option>
          ))}
        </select>
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
          aria-invalid={showError}
          aria-describedby={`${id}-hint`}
          className="w-full bg-transparent py-3 text-lg outline-none placeholder:text-bone/25"
        />
      </div>
      <p id={`${id}-hint`} className={`mt-2 text-xs ${showError ? "text-flare" : "text-bone/50"}`} aria-live="polite">
        {value.valid && value.international
          ? `Saved as ${value.international}`
          : showError
            ? `That doesn't look like a valid number for ${current?.name ?? value.country}. Type it with a + if it's from another country.`
            : `Type your local number for ${current?.name ?? value.country}; we add the country code.`}
      </p>
    </div>
  );
}
