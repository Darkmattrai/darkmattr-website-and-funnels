"use client";

import { usePathname } from "next/navigation";
import { Cursor } from "./Cursor";
import { Preloader } from "./Preloader";

/** The brand-site chrome (preloader, custom cursor) stays off the hiring funnel, where speed and plain inputs win. */
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname.startsWith("/selling-system")) return null;
  return (
    <>
      <Preloader />
      <Cursor />
    </>
  );
}
