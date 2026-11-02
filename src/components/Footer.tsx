"use client";

import { nav, site } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden pt-20 md:pt-28">
      <div className="container-x grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="max-w-sm font-serif text-3xl italic leading-tight text-bone/90 md:text-4xl">
            The best marketing is the kind you never see coming.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contact");
            }}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-flare px-6 py-3.5 font-medium text-void transition-colors hover:bg-bone"
          >
            Start a project →
          </a>
        </div>
        <div>
          <p className="label">Navigate</p>
          <ul className="mt-5 space-y-2.5">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget(n.href);
                  }}
                  className="text-bone/70 transition-colors hover:text-bone"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label">Signal</p>
          <ul className="mt-5 space-y-2.5">
            <li>
              <a href={`mailto:${site.email}`} className="text-bone/70 transition-colors hover:text-bone">
                {site.email}
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="text-bone/70 transition-colors hover:text-bone">
                  {s.label} ↗
                </a>
              </li>
            ))}
            <li className="pt-2 text-bone/40">{site.location}</li>
          </ul>
        </div>
      </div>

      <div className="container-x mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-bone/45">
        <span>© {year} {site.name}. All rights reserved.</span>
        <button type="button" onClick={() => scrollToTarget(0)} className="hover:text-bone">
          Back to top ↑
        </button>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="display text-gradient translate-y-[12%] whitespace-nowrap text-center text-[19.5vw] !leading-[0.8]">
          Dark Mattr
        </p>
      </div>
    </footer>
  );
}
