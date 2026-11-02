import { marquee } from "@/content/site";

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="relative overflow-hidden border-y border-line py-5 md:py-7" aria-label={marquee.join(", ")}>
      <div className="marquee-track flex w-max items-center gap-10 [--marquee-speed:45s] md:gap-16" aria-hidden>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10 md:gap-16">
            <span
              className={`display whitespace-nowrap text-[clamp(1.8rem,4vw,3.5rem)] ${
                i % 2 ? "font-serif font-normal italic tracking-[-0.02em] text-bone/45" : ""
              }`}
            >
              {item}
            </span>
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-flare md:size-7" aria-hidden>
              <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
