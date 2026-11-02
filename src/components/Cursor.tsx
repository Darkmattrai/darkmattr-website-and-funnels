"use client";

import { useEffect, useRef } from "react";

/**
 * A two-part cursor: a precise dot and a lagging ring.
 * Elements with data-cursor="Label" grow the ring and show the label.
 * Interactive elements (a, button, [role=button], inputs) get a subtle grow.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    document.documentElement.classList.add("has-cursor");

    let mx = -100, my = -100, rx = -100, ry = -100;
    let scale = 1, targetScale = 1;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        rx = mx;
        ry = my;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button'], input, textarea, select, label",
      );
      const text = el?.dataset.cursor ?? "";
      if (label.current && label.current.textContent !== text) label.current.textContent = text;
      targetScale = text ? 3.2 : el ? 1.9 : 1;
      ring.current?.classList.toggle("has-label", Boolean(text));
    };
    const onLeave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      ring.current?.style.setProperty("opacity", "0");
    };
    const onDown = () => (targetScale *= 0.75);
    const onUp = () => (targetScale /= 0.75);

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      scale += (targetScale - scale) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[90] grid size-8 place-items-center rounded-full border border-bone/40 opacity-0 transition-[opacity,background-color,border-color] duration-300 [&.has-label]:border-transparent [&.has-label]:bg-flare"
      >
        <span ref={label} className="label whitespace-nowrap !text-[0.42rem] !tracking-[0.08em] font-semibold text-void" />
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[91] size-1.5 rounded-full bg-flare opacity-0"
      />
    </>
  );
}
