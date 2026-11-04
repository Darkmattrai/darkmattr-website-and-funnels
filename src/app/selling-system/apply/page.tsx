import type { Metadata } from "next";
import Link from "next/link";
import { Survey } from "@/components/hiring/Survey";
import { BrandLogo } from "@/components/hiring/BrandLogo";

export const metadata: Metadata = {
  title: "Application · The Selling System",
  description: "Eight questions about how you sell, plus your resume.",
  robots: { index: false },
};

export default function ApplyPage() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-ink">
      <div className="pointer-events-none absolute -top-1/3 right-0 size-[80vmax] rounded-full bg-[radial-gradient(circle,rgba(139,92,255,0.12),rgba(255,91,46,0.06)_35%,transparent_60%)]" />
      <header className="container-x relative flex h-16 items-center justify-between md:h-20">
        <Link href="/selling-system" className="flex items-center gap-2.5 text-[0.95rem] tracking-tight">
          <BrandLogo priority className="h-5 w-auto md:h-6" />
          <span className="hidden text-bone/50 sm:inline">· The Selling System</span>
        </Link>
        <span className="label">Step 2 of 2 · Survey</span>
      </header>
      <div className="container-x relative py-10 md:py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-line bg-void/70 p-6 backdrop-blur-md sm:p-8 md:p-12">
          <Survey />
        </div>
      </div>
    </main>
  );
}
