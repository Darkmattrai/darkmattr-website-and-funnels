"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { Fragment, type ElementType, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** Splits text into words that slide up out of a mask when scrolled into view. */
export function RevealText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.045,
  accent = [],
  accentClassName = "font-serif font-normal italic tracking-[-0.02em] text-gradient",
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Words rendered in the italic gradient accent style. */
  accent?: string[];
  accentClassName?: string;
}) {
  const lines = text.split("\n");
  let index = 0;
  return (
    <Tag className={className} aria-label={text.replace(/\n/g, " ")}>
      {/* The observer sits on the unclipped wrapper; words inherit the variant. */}
      <motion.span
        aria-hidden
        className="block"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      >
        {lines.map((line, li) => {
          const words = line.split(" ");
          return (
            <span key={li} className="block">
              {words.map((word, wi) => {
                const i = index++;
                return (
                  <Fragment key={wi}>
                    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span
                        className={`inline-block ${accent.includes(word) ? accentClassName : ""}`}
                        variants={{ hidden: { y: "110%" }, show: { y: "0%" } }}
                        transition={{ duration: 1, ease, delay: delay + i * stagger }}
                      >
                        {word}
                      </motion.span>
                    </span>
                    {wi < words.length - 1 && " "}
                  </Fragment>
                );
              })}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}

export function FadeUp({
  children,
  delay = 0,
  className,
  ...rest
}: { children: ReactNode; delay?: number; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="size-1.5 rounded-full bg-flare" />
      <span className="label">{children}</span>
    </div>
  );
}
