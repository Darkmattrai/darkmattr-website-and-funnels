"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { universe } from "@/content/site";
import { LogoMark } from "./Logo";
import { RevealText, SectionLabel } from "./Reveal";

const RINGS = [
  { size: 56, duration: 46 },
  { size: 78, duration: 70 },
  { size: 100, duration: 100 },
];

export function Universe() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const bodies = universe.bodies;
  const current = bodies[active];

  // distribute bodies across rings, spaced evenly per ring
  const placed = bodies.map((b, i) => {
    const ring = i % RINGS.length;
    const onRing = bodies.filter((_, j) => j % RINGS.length === ring);
    const k = onRing.indexOf(b);
    const angle = (360 / onRing.length) * k + ring * 50;
    return { ...b, index: i, ring, angle };
  });

  return (
    <section id="universe" className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[110vmax] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(139,92,255,0.12),transparent_45%)]" />

      <div className="container-x relative grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <SectionLabel>{universe.label}</SectionLabel>
          <RevealText
            as="h2"
            text={universe.title}
            className="display mt-8 text-[clamp(2.6rem,6.4vw,6.5rem)]"
            accent={["galaxy."]}
            accentClassName="font-serif font-normal italic tracking-[-0.02em] text-gradient-cool"
          />
        </div>
        <p className="max-w-md text-lg leading-relaxed text-bone/65 md:justify-self-end">{universe.sub}</p>
      </div>

      <div className="container-x relative mt-14 grid items-center gap-12 md:mt-20 lg:grid-cols-[1.25fr_1fr]">
        {/* Orbit system */}
        <div
          className="relative mx-auto aspect-square w-full max-w-[min(88vw,640px)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {RINGS.map((r, ri) => (
            <div
              key={ri}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: `${r.size}%`, height: `${r.size}%` }}
            >
              <div className="absolute inset-0 rounded-full border border-bone/10" />
              <div
                className="absolute inset-0"
                style={{
                  animation: `orbit ${r.duration}s linear infinite`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              >
                {placed
                  .filter((p) => p.ring === ri)
                  .map((p) => (
                    <div key={p.name} className="absolute inset-0" style={{ transform: `rotate(${p.angle}deg)` }}>
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                        <div style={{ transform: `rotate(${-p.angle}deg)` }}>
                          <div
                            style={{
                              animation: `counter-orbit ${r.duration}s linear infinite`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => setActive(p.index)}
                              onMouseEnter={() => setActive(p.index)}
                              onFocus={() => setActive(p.index)}
                              aria-pressed={active === p.index}
                              data-cursor="Enter"
                              className="group flex flex-col items-center gap-2"
                            >
                              <span
                                className={`relative block rounded-full transition-transform duration-500 ${
                                  active === p.index ? "scale-125" : "group-hover:scale-110"
                                }`}
                                style={{
                                  width: `clamp(14px, ${2 + ri * 0.6}vw, ${26 + ri * 6}px)`,
                                  height: `clamp(14px, ${2 + ri * 0.6}vw, ${26 + ri * 6}px)`,
                                  background: `radial-gradient(circle at 30% 30%, #fff, ${p.color} 45%, #07070a 120%)`,
                                  boxShadow: `0 0 ${active === p.index ? 36 : 18}px ${p.color}99`,
                                }}
                              />
                              <span
                                className={`whitespace-nowrap rounded-full border px-3 py-1 text-[0.7rem] font-medium backdrop-blur-sm transition-colors md:text-xs ${
                                  active === p.index
                                    ? "border-bone bg-bone text-void"
                                    : "border-line bg-void/60 text-bone/80"
                                }`}
                              >
                                {p.name}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Core */}
          <div className="absolute left-1/2 top-1/2 grid size-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#2a2238,#07070a_70%)] shadow-[0_0_80px_rgba(255,91,46,0.35),inset_0_0_30px_rgba(139,92,255,0.35)]">
            <div className="absolute inset-0 animate-[orbit_14s_linear_infinite] rounded-full border border-dashed border-flare/40" />
            <div className="flex flex-col items-center gap-1 text-center">
              <LogoMark className="size-7 md:size-9" />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] md:text-xs">Dark Mattr</span>
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div className="relative min-h-[280px] rounded-[2rem] border border-line bg-panel/60 p-7 backdrop-blur-sm md:p-10">
          <div className="flex items-center justify-between">
            <span className="label">
              Body {String(active + 1).padStart(2, "0")} / {String(bodies.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              {(["←", "→"] as const).map((arrow, i) => (
                <button
                  key={arrow}
                  type="button"
                  aria-label={i ? "Next" : "Previous"}
                  onClick={() => setActive((a) => (a + (i ? 1 : -1) + bodies.length) % bodies.length)}
                  className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-bone/50"
                >
                  {arrow}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs"
                style={{ color: current.color }}
              >
                <span className="size-1.5 rounded-full" style={{ background: current.color }} />
                {current.kind}
              </span>
              <h3 className="display mt-5 text-[clamp(2.4rem,4.4vw,4rem)]">{current.name}</h3>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-bone/70">{current.line}</p>
              {current.href && (
                <a
                  href={current.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 border-b border-bone/30 pb-1 text-sm hover:border-bone"
                >
                  Visit {current.name} ↗
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
