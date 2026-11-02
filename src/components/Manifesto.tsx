"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { manifesto } from "@/content/site";
import { SectionLabel } from "./Reveal";

function Word({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={highlight ? "font-serif font-normal italic tracking-[-0.02em] text-flare" : undefined}
    >
      {children}{" "}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  const words = manifesto.text.split(" ");
  // mark words that belong to a highlighted phrase
  const flags = new Array(words.length).fill(false);
  for (const phrase of manifesto.highlight) {
    const parts = phrase.split(" ");
    for (let i = 0; i <= words.length - parts.length; i++) {
      if (parts.every((p, j) => words[i + j].replace(/[.,:]/g, "") === p.replace(/[.,:]/g, ""))) {
        for (let j = 0; j < parts.length; j++) flags[i + j] = true;
      }
    }
  }

  return (
    <section id="manifesto" className="container-x relative py-28 md:py-44">
      <SectionLabel>{manifesto.label}</SectionLabel>
      <div ref={ref} className="mt-10 md:mt-14">
        <p className="display max-w-[22ch] text-[clamp(2rem,5.4vw,5.6rem)] !leading-[1.02]" aria-label={manifesto.text}>
          <span aria-hidden>
            {words.map((w, i) => (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / words.length, Math.min(1, (i + 3) / words.length)]}
                highlight={flags[i]}
              >
                {w}
              </Word>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
