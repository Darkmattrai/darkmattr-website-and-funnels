"use client";

import { useEffect, useRef } from "react";

/** Every second frame of the Higgsfield fusion clip, cut into public/fusion/{lg,sm}. */
const FRAMES = 61;
/** The last stretch of the scroll holds the fused pose, so it lands before the stage moves on. */
const HOLD = 0.12;
const WIDE = "(min-width: 1024px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

type FrameSet = "lg" | "sm";
const frameUrl = (set: FrameSet, i: number) => `/fusion/${set}/${String(i).padStart(3, "0")}.webp`;

/** Coarse to fine (0, 32, 16, 48, 8, ...), so scrubbing has something close to show while the rest arrive. */
function loadOrder() {
  const order: number[] = [];
  for (const step of [32, 16, 8, 4, 2, 1]) {
    for (let i = 0; i < FRAMES; i += step) if (!order.includes(i)) order.push(i);
  }
  if (!order.includes(FRAMES - 1)) order.splice(1, 0, FRAMES - 1);
  return order;
}

/**
 * The clay founders stand side by side, turn and reach until their fingertips meet, driven by scroll.
 * The stage pins (CSS sticky) inside its runway; scroll progress through the runway picks the frame.
 */
export function FusionStage({ alt, caption }: { alt: string; caption: string }) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!runway || !sticky || !stage || !canvas || !ctx) return;
    if (matchMedia(REDUCED).matches) return; // the poster already shows the fused pose

    const wide = matchMedia(WIDE);
    let set: FrameSet = wide.matches ? "lg" : "sm";
    let frames: HTMLImageElement[] = [];
    let ready: boolean[] = [];
    let generation = 0;
    let shown = -1;
    let raf = 0;
    let started = false;

    const progress = () => {
      const r = runway.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(sticky).top) || 0;
      const travel = r.height - sticky.offsetHeight;
      if (travel <= 0) return 0;
      const docTop = r.top + window.scrollY;
      // On desktop the stage is pinned from the first pixel, so count from the top of the page.
      const start = Math.max(0, docTop - top);
      const end = docTop - top + travel;
      return Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)));
    };

    const wanted = () => Math.round(Math.min(1, progress() / (1 - HOLD)) * (FRAMES - 1));

    const draw = (force = false) => {
      const want = wanted();
      let i = want;
      if (!ready[i]) {
        // Show the nearest frame that has arrived.
        for (let d = 1; d < FRAMES; d++) {
          if (ready[want - d]) { i = want - d; break; }
          if (ready[want + d]) { i = want + d; break; }
        }
        if (!ready[i]) return;
      }
      if (i === shown && !force) return;
      shown = i;
      ctx.drawImage(frames[i], 0, 0, canvas.width, canvas.height);
    };

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = stage.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      shown = -1;
      draw(true);
    };

    const load = () => {
      const gen = ++generation;
      frames = Array.from({ length: FRAMES }, () => new Image());
      ready = new Array(FRAMES).fill(false);
      shown = -1;
      const order = loadOrder();
      let next = 0;
      const pump = () => {
        if (gen !== generation || next >= order.length) return;
        const i = order[next++];
        const img = frames[i];
        img.decoding = "async";
        img.onload = () => {
          if (gen !== generation) return;
          ready[i] = true;
          draw();
          pump();
        };
        img.onerror = pump;
        img.src = frameUrl(set, i);
      };
      for (let k = 0; k < 6; k++) pump();
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        draw();
      });
    };
    const onWide = () => {
      set = wide.matches ? "lg" : "sm";
      fit();
      load();
    };

    // Start loading once the stage is close; on desktop it is in the first screen.
    const io = new IntersectionObserver(
      (entries) => {
        if (started || !entries.some((e) => e.isIntersecting)) return;
        started = true;
        io.disconnect();
        load();
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(stage);
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    wide.addEventListener("change", onWide);
    return () => {
      generation++;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", onWide);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={runwayRef} className="fusion-runway">
      <div ref={stickyRef} className="fusion-sticky">
        <div aria-hidden className="fusion-glow" />
        <div ref={stageRef} className="fusion-stage" role="img" aria-label={alt}>
          <picture>
            <source media={`${REDUCED} and ${WIDE}`} srcSet={frameUrl("lg", FRAMES - 1)} />
            <source media={REDUCED} srcSet={frameUrl("sm", FRAMES - 1)} />
            <source media={WIDE} srcSet={frameUrl("lg", 0)} />
            {/* Poster for the canvas: the first frame, or the fused pose for reduced motion */}
            <img src={frameUrl("sm", 0)} alt="" fetchPriority="high" className="fusion-frame" />
          </picture>
          <canvas ref={canvasRef} aria-hidden className="fusion-frame" />
        </div>
        <p className="label fusion-caption">{caption}</p>
      </div>
    </div>
  );
}
