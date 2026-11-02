"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { lockScroll } from "@/lib/scroll";

const words = ["Detecting dark matter", "Bending light", "Calibrating gravity", "Opening the void"];

export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let repeat = false;
    try {
      repeat = sessionStorage.getItem("dm-visited") === "1";
      sessionStorage.setItem("dm-visited", "1");
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 200 : repeat ? 700 : 2100;

    lockScroll(true);
    window.scrollTo(0, 0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          lockScroll(false);
          document.documentElement.dataset.loaded = "true";
          window.dispatchEvent(new Event("dm:loaded"));
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lockScroll(false);
    };
  }, []);

  const word = words[Math.min(words.length - 1, Math.floor((count / 100) * words.length))];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[80] flex flex-col justify-between bg-void p-[var(--gutter)]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease: [0.83, 0, 0.17, 1] }}
          aria-hidden
        >
          <div className="flex items-center justify-between">
            <span className="label">Dark Mattr</span>
            <span className="label">{word}…</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="relative h-px flex-1 self-center bg-line">
              <div className="absolute inset-y-0 left-0 bg-flare" style={{ width: `${count}%` }} />
            </div>
            <span className="display text-[clamp(5rem,18vw,16rem)] tabular-nums text-bone">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
