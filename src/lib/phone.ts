import { getTimezone } from "countries-and-timezones";
import {
  AsYouType,
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/max";

export type { CountryCode };

export type PhoneResult = {
  /** What the user typed, formatted as they type (national or international). */
  text: string;
  country: CountryCode;
  /** +96171097342 */
  e164: string | null;
  /** +961 71 097 342 */
  international: string | null;
  /** 71097342: the number without its country code */
  national: string | null;
  valid: boolean;
};

const FALLBACK: CountryCode = "LB";
const VALID_CODES = new Set<string>(getCountries());

/**
 * Best guess at the visitor's country, so they can type a local number
 * (03 097 342) and we store it internationally (+961 3 097 342).
 * Order: IANA timezone → browser locale region → Lebanon.
 */
export function detectCountry(): CountryCode {
  if (typeof window === "undefined") return FALLBACK;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const info = tz ? getTimezone(tz) : null;
    const first = info?.countries?.[0];
    if (first && VALID_CODES.has(first)) return first as CountryCode;
  } catch {}
  try {
    const region = new Intl.Locale(navigator.language).region;
    if (region && VALID_CODES.has(region)) return region as CountryCode;
  } catch {}
  return FALLBACK;
}

// English names come from the runtime's ICU, which differs slightly between Node and browsers
// (e.g. "Hong Kong SAR China" vs "Hong Kong"), so this list is only rendered after hydration.
const displayNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();
const collator = new Intl.Collator("en");

export const countries: { code: CountryCode; callingCode: string; name: string }[] = getCountries()
  .map((code) => ({
    code,
    callingCode: getCountryCallingCode(code),
    name: displayNames?.of(code) ?? code,
  }))
  .sort((a, b) => collator.compare(a.name, b.name));

/** Hydration-safe list (ISO code order, no names): identical on server and client. */
export const countriesByCode = [...countries].sort((a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0));

/** Format while typing. A leading "+" lets the user type any international number. */
export function formatPhone(input: string, country: CountryCode): PhoneResult {
  const typer = new AsYouType(country);
  const text = typer.input(input);
  const number = typer.getNumber();
  const detected = (typer.getCountry() ?? number?.country ?? country) as CountryCode;
  const valid = number ? isValidPhoneNumber(number.number) : false;
  return {
    text,
    country: detected,
    e164: number?.number ?? null,
    international: number?.formatInternational() ?? null,
    national: number?.nationalNumber ?? null,
    valid,
  };
}

/** Server-side normalisation of whatever the client sent. */
export function normalizePhone(input: string, country?: string): { e164: string; international: string; country: string } | null {
  const cc = country && VALID_CODES.has(country) ? (country as CountryCode) : undefined;
  const parsed = parsePhoneNumberFromString(input, cc);
  if (!parsed || !isValidPhoneNumber(parsed.number)) return null;
  return { e164: parsed.number, international: parsed.formatInternational(), country: parsed.country ?? cc ?? "" };
}
