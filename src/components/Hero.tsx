"use client";

import { motion } from "motion/react";
import { hero } from "@/content/site";
import { scrollToTarget } from "@/lib/scroll";
import { useLoaded } from "@/lib/useLoaded";
import { Galaxy } from "./Galaxy";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay, show }: { children: React.ReactNode; delay: number; show: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={{ y: "110%", rotate: 3 }}
        animate={show ? { y: "0%", rotate: 0 } : undefined}
        transition={{ duration: 1.3, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const show = useLoaded();

  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden select-none">
      <Galaxy className="absolute inset-0 size-full" />
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,7,10,0.85)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-void" />

      <div className="container-x pointer-events-none relative z-10 flex h-full flex-col justify-end pb-8 pt-24 md:pb-10">
        <motion.div
          className="mb-6 flex items-center gap-3 md:mb-8"
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <span className="size-1.5 rounded-full bg-flare" />
          <span className="label">{hero.eyebrow}</span>
        </motion.div>

        <h1 className="display text-[clamp(3.1rem,10.4vw,11.5rem)]">
          <Line show={show} delay={0.05}>
            {hero.lineOne}
          </Line>
          <Line show={show} delay={0.18}>
            <span className="font-serif font-normal italic tracking-[-0.03em]">
              <span className="text-gradient pr-[0.08em]">{hero.lineTwo}</span>
            </span>
          </Line>
        </h1>

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[minmax(0,34rem)_1fr] md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.1, ease, delay: 0.5 }}
          >
            <p className="max-w-[34rem] text-[1.05rem] leading-relaxed text-bone/75 md:text-lg">{hero.sub}</p>
            <div className="pointer-events-auto mt-7 flex flex-wrap gap-3">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
                className="group inline-flex items-center gap-3 rounded-full bg-flare py-3.5 pl-6 pr-3.5 font-medium text-void transition-colors hover:bg-bone"
              >
                {hero.primaryCta}
                <span className="grid size-7 place-items-center rounded-full bg-void text-bone transition-transform duration-500 group-hover:rotate-[-45deg]">
                  →
                </span>
              </a>
              <a
                href="#universe"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#universe");
                }}
                className="inline-flex items-center gap-2 rounded-full border border-bone/20 px-6 py-3.5 font-medium backdrop-blur-sm transition-colors hover:border-bone/60"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hidden items-end justify-end gap-10 md:flex"
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : undefined}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <p className="label flex items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-flare" />
              {hero.hint}
            </p>
            <div className="flex flex-col items-center gap-2">
              <span className="label [writing-mode:vertical-rl]">Scroll</span>
              <span className="relative h-14 w-px overflow-hidden bg-line">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-bone" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
