"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { faq } from "@/content/site";
import { SectionLabel } from "./Reveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-x grid gap-10 py-24 md:py-32 lg:grid-cols-[1fr_1.6fr]">
      <div>
        <SectionLabel>Questions from the void</SectionLabel>
        <h2 className="display mt-8 text-[clamp(2.4rem,4.8vw,4.6rem)]">
          Before you <span className="font-serif font-normal italic tracking-[-0.02em] text-gradient">ask.</span>
        </h2>
      </div>
      <ul className="border-t border-line">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <li key={item.q} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl font-medium tracking-tight md:py-8 md:text-2xl"
              >
                {item.q}
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full border border-line transition-transform duration-500 ${
                    isOpen ? "rotate-45 bg-flare text-void" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pb-8 text-lg leading-relaxed text-bone/65">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
