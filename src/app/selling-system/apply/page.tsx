import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/hiring/BrandLogo";
import { Survey } from "@/components/hiring/Survey";

export const metadata: Metadata = {
  title: "Application · The Selling System",
  description: "Eight questions about how you sell, plus your resume.",
  robots: { index: false },
};

export default function ApplyPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(127,255,0,0.08),transparent)]"
      />
      <header className="container-x relative mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between md:h-20">
        <Link href="/selling-system" aria-label="Back to The Selling System roles" className="shrink-0">
          <BrandLogo priority className="h-7 w-auto md:h-9" />
        </Link>
        <span className="text-sm font-semibold text-bone/75">Step 2 of 2 · Survey</span>
      </header>
      <div className="container-x relative py-8 md:py-14">
        <div className="dm-raised mx-auto max-w-2xl rounded-[1.75rem] p-6 sm:p-8 md:p-12">
          <Survey />
        </div>
      </div>
    </main>
  );
}
