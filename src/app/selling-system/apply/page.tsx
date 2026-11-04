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
      <span aria-hidden className="clay-ball clay-ball-sun clay-bob absolute -right-10 top-24 size-40 opacity-90 md:right-[8%]" />
      <span aria-hidden className="clay-ball clay-ball-sky clay-bob absolute -left-6 bottom-24 size-20 [animation-delay:-1s] md:left-[8%]" />
      <header className="container-x relative mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between md:h-20">
        <Link href="/selling-system" aria-label="Back to The Selling System roles" className="shrink-0">
          <BrandLogo priority />
        </Link>
        <span className="clay-chip">Step 2 of 2 · Survey</span>
      </header>
      <div className="container-x relative py-8 md:py-14">
        <div className="clay-card relative mx-auto max-w-2xl p-6 sm:p-8 md:p-12">
          <Survey />
        </div>
      </div>
    </main>
  );
}
