import type { Metadata } from "next";
import { ApplyModal } from "@/components/hiring/ApplyModal";
import { BrandLogo } from "@/components/hiring/BrandLogo";
import { FadeUp, RevealText } from "@/components/Reveal";
import { hiring } from "@/content/hiring";
import { site } from "@/content/site";

const shareTitle = "Join the fastest-growing sales team in the region · The Selling System";

export const metadata: Metadata = {
  title: "Join The Selling System · Setters, Closers, Outbound",
  description: `${hiring.about} Now hiring DM/Phone Setters, Closers and Outbound Sales Specialists. Remote.`,
  alternates: { canonical: "/selling-system" },
  openGraph: { title: shareTitle, description: hiring.sub, url: "/selling-system", siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image", title: shareTitle, description: hiring.sub },
};

export default function SellingSystemHiring() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Ambient brand glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[20vmax] -top-[25vmax] size-[75vmax] rounded-full bg-[radial-gradient(closest-side,rgba(255,91,46,0.2),rgba(139,92,255,0.08)_55%,transparent)]" />
        <div className="absolute -bottom-[35vmax] -left-[20vmax] size-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,255,0.14),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <header className="container-x relative z-10 flex h-16 items-center justify-between md:h-20">
        <a href={site.url} className="flex items-center gap-2.5 text-[0.95rem] tracking-tight">
          <BrandLogo priority className="h-5 w-auto md:h-6" />
        </a>
      </header>

      <main className="container-x relative z-10 flex flex-1 items-center py-6 md:py-8">
        <div className="w-full max-w-[64rem]">
          <h1 className="display text-[clamp(2.4rem,5.6vw,5.75rem)] !leading-[0.98]">
            <RevealText text={hiring.headline.lineOne} as="span" className="block" accent={[hiring.headline.accent]} />
            <RevealText text={hiring.headline.lineTwo} as="span" className="block" delay={0.15} />
          </h1>
          <FadeUp delay={0.3}>
            <p className="mt-6 max-w-[40rem] text-base leading-relaxed text-bone/75 sm:text-lg md:text-xl">{hiring.sub}</p>
            <ul className="mt-6 flex max-w-[48rem] flex-wrap gap-2.5" aria-label="Why sell here">
              {hiring.chips.map((c) => (
                <li key={c} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1.5 text-[0.8rem] sm:px-3.5 sm:py-2 sm:text-sm text-bone/85 backdrop-blur-sm">
                  <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 shrink-0 text-flare" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <ApplyModal className="group inline-flex items-center gap-4 rounded-full bg-flare py-3.5 pl-7 pr-3.5 text-lg font-medium text-void shadow-[0_18px_50px_-12px_rgba(255,91,46,0.55)] transition-colors hover:bg-bone">
                {hiring.primaryCta}
                <span className="grid size-9 place-items-center rounded-full bg-void text-bone transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
              </ApplyModal>
              <p className="flex items-center gap-2 text-sm text-bone/70">
                <span className="pulse-dot size-1.5 rounded-full bg-flare" />
                {hiring.seats}
              </p>
            </div>
          </FadeUp>
        </div>
      </main>
    </div>
  );
}
