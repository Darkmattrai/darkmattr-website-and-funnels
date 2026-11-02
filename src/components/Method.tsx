"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { method } from "@/content/site";
import { RevealText, SectionLabel } from "./Reveal";

export function Method() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="method" className="relative bg-ink py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flare/50 to-transparent" />
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>{method.label}</SectionLabel>
          <RevealText
            as="h2"
            text={method.title}
            className="display mt-8 text-[clamp(2.6rem,6vw,6rem)]"
            accent={["up."]}
          />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/65">
            No black boxes and no six-month &ldquo;discovery phases&rdquo;. A clear system, a clear timeline, and numbers you can check every single week.
          </p>
        </div>

        <div ref={ref} className="relative pl-8 md:pl-14">
          <div className="absolute bottom-0 left-0 top-0 w-px bg-line">
            <motion.div style={{ height: lineHeight }} className="w-full bg-gradient-to-b from-flare to-plasma" />
          </div>
          {method.steps.map((s, i) => (
            <motion.article
              key={s.n}
              className="relative pb-16 last:pb-0 md:pb-24"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
            >
              <span className="absolute -left-8 top-3 size-3 -translate-x-1/2 rounded-full border border-flare bg-ink md:-left-14 md:top-5" />
              <div className="flex items-baseline justify-between gap-4">
                <span className="display text-[clamp(4rem,9vw,8rem)] text-transparent [-webkit-text-stroke:1px_rgba(239,238,233,0.25)]">
                  {s.n}
                </span>
                <span className="label">{s.time}</span>
              </div>
              <h3 className="display mt-2 text-[clamp(1.8rem,3.4vw,3rem)]">{s.name}</h3>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-bone/65">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
