"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { lockScroll, scrollToTarget } from "@/lib/scroll";
import { LogoMark } from "./Logo";

const ease = [0.83, 0, 0.17, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // wait for the menu to start closing before scrolling
    setTimeout(() => scrollToTarget(href), open ? 450 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter] duration-500 ${
          scrolled && !open ? "bg-void/60 backdrop-blur-md" : ""
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between md:h-20">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="group flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight"
          >
            <LogoMark className="size-6 transition-transform duration-700 group-hover:rotate-[200deg]" />
            Dark Mattr
          </a>

          <nav className="hidden items-center gap-7 text-[0.9rem] lg:flex" aria-label="Primary">
            {nav.slice(0, 5).map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.href);
                }}
                className="text-bone/70 transition-colors hover:text-bone"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
              }}
              className="hidden items-center gap-2 rounded-full bg-bone px-4 py-2 text-[0.85rem] font-medium text-void transition-colors hover:bg-flare sm:flex"
            >
              <span className="pulse-dot size-1.5 rounded-full bg-green-500" />
              Book a call
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu"
              className="group flex h-9 items-center gap-2.5 rounded-full border border-line px-4 text-[0.85rem] transition-colors hover:border-bone/40"
            >
              <span className="relative block h-2.5 w-4">
                <span
                  className={`absolute left-0 h-px w-full bg-bone transition-transform duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-full bg-bone transition-transform duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`}
                />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[65] flex flex-col bg-ink pt-20 md:pt-24"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="container-x grid flex-1 grid-cols-1 gap-10 overflow-y-auto pb-8 lg:grid-cols-[1.4fr_1fr]">
              <ul className="flex flex-col justify-center" onMouseLeave={() => setHovered(null)}>
                {nav.map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.href);
                      }}
                      onMouseEnter={() => setHovered(i)}
                      onFocus={() => setHovered(i)}
                      className="group flex items-baseline gap-4 py-0.5 md:gap-8"
                      initial={{ y: "105%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "105%" }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                    >
                      <span className="label w-6 shrink-0">0{i + 1}</span>
                      <span
                        className={`display text-[clamp(2.9rem,9vw,7.5rem)] transition-[color,opacity,transform] duration-500 group-hover:translate-x-3 ${
                          hovered !== null && hovered !== i ? "opacity-25" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ul>

              <motion.div
                className="hidden flex-col justify-center lg:flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[2rem] border border-line bg-void">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(255,91,46,0.35),transparent_45%),radial-gradient(circle_at_40%_40%,rgba(139,92,255,0.35),transparent_55%)]" />
                  <div className="absolute inset-[22%] animate-[orbit_18s_linear_infinite] rounded-full border border-bone/15" />
                  <div className="absolute inset-[34%] animate-[counter-orbit_12s_linear_infinite] rounded-full border border-dashed border-bone/20" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <span className="label">{hovered !== null ? `0${hovered + 1}` : "Navigate"}</span>
                    <p className="mt-2 font-serif text-4xl italic leading-tight">
                      {hovered !== null ? nav[hovered].note : "Choose your destination."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-bone/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              <a href={`mailto:${site.email}`} className="hover:text-bone">
                {site.email}
              </a>
              <div className="flex gap-6">
                {site.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-bone">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
