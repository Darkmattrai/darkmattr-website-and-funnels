"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ApplyStepOne } from "./ApplyStepOne";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * A trigger button that opens the Step 1 form in an accessible dialog.
 * Focus trap, Esc / backdrop to close, body scroll lock, focus restore.
 */
export function ApplyModal({ children, className, ariaLabel }: { children: ReactNode; className?: string; ariaLabel?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    const t = window.setTimeout(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>("input:not([tabindex='-1'])");
      (first ?? dialogRef.current)?.focus();
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <>
      <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
            <div aria-hidden className="modal-backdrop absolute inset-0 bg-void/80 backdrop-blur-md" onClick={close} data-testid="modal-backdrop" />
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              tabIndex={-1}
              className="modal-panel relative max-h-[92svh] w-full overflow-y-auto overflow-x-hidden rounded-t-[2rem] border border-line bg-ink shadow-[0_40px_120px_-20px_rgba(255,91,46,0.25)] outline-none sm:max-w-xl sm:rounded-[2rem]"
            >
              <div aria-hidden className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(255,91,46,0.18),transparent)]" />
              <button
                type="button"
                onClick={close}
                aria-label="Close application form"
                className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-line text-bone/70 transition-colors hover:border-bone/50 hover:text-bone"
              >
                <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <div className="relative p-6 pt-8 sm:p-9">
                <ApplyStepOne compact titleId={titleId} />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
