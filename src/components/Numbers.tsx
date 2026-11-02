"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { numbers } from "@/content/site";
import { SectionLabel } from "./Reveal";

function Counter({ value, decimals = 0, prefix, suffix }: { value: number; decimals?: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, decimals, prefix, suffix]);
  return (
    <span ref={ref}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Numbers() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionLabel>{numbers.label}</SectionLabel>
      <div className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {numbers.stats.map((s, i) => (
          <div
            key={s.label}
            className={`border-b border-line py-10 sm:px-6 lg:border-b-0 lg:py-14 ${i > 0 ? "lg:border-l" : ""} ${i % 2 ? "sm:border-l" : ""} ${i === 0 ? "sm:pl-0" : ""}`}
          >
            <div className="display text-gradient text-[clamp(3.6rem,7vw,6.5rem)] tabular-nums">
              <Counter value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <p className="mt-4 max-w-[16rem] text-bone/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
