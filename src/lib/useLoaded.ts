"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("dm:loaded", cb);
  return () => window.removeEventListener("dm:loaded", cb);
};

/** True once the preloader has finished. */
export function useLoaded() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.loaded === "true",
    () => false,
  );
}
