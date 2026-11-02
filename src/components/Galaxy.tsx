"use client";

import { useEffect, useRef } from "react";

type Star = {
  r: number; // orbital radius (0..1 of galaxy radius)
  a: number; // angle
  speed: number;
  size: number;
  bucket: number;
  y: number; // vertical jitter for thickness
  twinkle: number;
};

const PALETTE = [
  "rgba(255, 236, 222, 0.95)", // hot core
  "rgba(255, 140, 90, 0.85)", // flare
  "rgba(239, 238, 233, 0.75)", // bone
  "rgba(160, 120, 255, 0.8)", // plasma
  "rgba(92, 225, 255, 0.7)", // ion
  "rgba(239, 238, 233, 0.45)", // dust
];

/**
 * A canvas spiral galaxy.
 *  - pointer acts as a gravity well that lenses nearby stars
 *  - press & hold collapses the galaxy into a singularity; release = big bang
 */
export function Galaxy({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const COUNT = mobile ? 3000 : 8000;
    const ARMS = 4;

    const stars: Star[] = [];
    for (let i = 0; i < COUNT; i++) {
      const core = Math.random() < 0.22;
      const r = core ? Math.pow(Math.random(), 2.2) * 0.22 : 0.08 + Math.pow(Math.random(), 0.9) * 0.92;
      const arm = i % ARMS;
      const armAngle = (arm / ARMS) * Math.PI * 2;
      // gaussian-ish scatter keeps the arms defined while leaving some haze
      const g = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
      const spread = core ? (Math.random() - 0.5) * 6 : g * (0.28 + r * 0.32);
      const a = armAngle + r * 5.2 + spread;
      let bucket: number;
      if (r < 0.12) bucket = 0;
      else if (r < 0.3) bucket = Math.random() < 0.6 ? 1 : 2;
      else bucket = [2, 3, 3, 4, 5, 5][Math.floor(Math.random() * 6)];
      stars.push({
        r,
        a,
        speed: 0.05 / Math.sqrt(r + 0.05),
        size: Math.random() < 0.05 ? 2.4 : Math.random() < 0.35 ? 1.5 : 1,
        bucket,
        y: (Math.random() - 0.5) * (core ? 0.12 : 0.04),
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Interaction state
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    let holding = false;
    let collapse = 0; // 0..1
    let collapseVel = 0;
    let scrollFade = 0;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = e.clientX - rect.left;
      pointer.ty = e.clientY - rect.top;
      if (!pointer.active) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("a, button, input, textarea")) return;
      const rect = canvas.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      holding = true;
    };
    const onUp = () => {
      if (holding) collapseVel = -0.09; // big bang kick
      holding = false;
    };
    const onScroll = () => {
      scrollFade = Math.min(1, window.scrollY / (h || 1));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let time = 0;

    const buckets: number[][] = PALETTE.map(() => []);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      time += dt;

      // collapse spring physics
      if (holding) {
        collapse += (1 - collapse) * 0.035;
        collapseVel = 0;
      } else {
        collapseVel += (0 - collapse) * 0.012;
        collapseVel *= 0.93;
        collapse += collapseVel;
      }

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const cx = w * (mobile ? 0.5 : 0.62);
      const cy = h * (mobile ? 0.42 : 0.48);
      const R = Math.max(w, h) * (mobile ? 0.62 : 0.5);
      const tilt = 0.42 + Math.sin(time * 0.1) * 0.03;
      const rot = time * 0.06;
      const radiusScale = Math.max(0.02, 1 - collapse * 0.97);
      const spinBoost = 1 + collapse * 7;

      // core glow
      const glowR = R * (0.38 + Math.max(0, -collapse) * 0.6) * (1 - collapse * 0.7);
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(1, glowR));
      glow.addColorStop(0, `rgba(255, 170, 120, ${0.32 + collapse * 0.5})`);
      glow.addColorStop(0.25, "rgba(255, 91, 46, 0.12)");
      glow.addColorStop(0.6, "rgba(139, 92, 255, 0.06)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const b of buckets) b.length = 0;

      const lensR = mobile ? 90 : 160;
      const pActive = pointer.active && !reduced;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!reduced) s.a += s.speed * dt * spinBoost;
        const ang = s.a + rot;
        const rr = s.r * R * radiusScale;
        let x = cx + Math.cos(ang) * rr;
        let y = cy + Math.sin(ang) * rr * tilt + s.y * R * radiusScale;

        // gravitational lensing around the pointer
        if (pActive) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < lensR * lensR * 4) {
            const d = Math.sqrt(d2) + 0.001;
            const pull = (lensR * lensR) / (d2 + lensR * 18);
            const k = Math.min(pull, d * 0.9) / d;
            // pull in, with a slight swirl
            x += dx * k * 0.55 - dy * k * 0.25;
            y += dy * k * 0.55 + dx * k * 0.25;
          }
        }
        buckets[s.bucket].push(x, y, s.size * (0.75 + 0.35 * Math.sin(time * 2 + s.twinkle)));
      }

      ctx.globalCompositeOperation = "lighter";
      for (let b = 0; b < buckets.length; b++) {
        ctx.fillStyle = PALETTE[b];
        const arr = buckets[b];
        for (let j = 0; j < arr.length; j += 3) {
          const sz = arr[j + 2];
          ctx.fillRect(arr[j], arr[j + 1], sz, sz);
        }
      }
      ctx.globalCompositeOperation = "source-over";

      // event-horizon ring around pointer
      if (pActive) {
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 18 + collapse * 10, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 91, 46, ${0.25 + collapse * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      canvas.style.opacity = String(1 - scrollFade * 0.85);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
