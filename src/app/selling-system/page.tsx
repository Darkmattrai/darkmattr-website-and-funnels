import type { Metadata } from "next";
import Image from "next/image";
import asSeenOn from "@/assets/brand/as-seen-on.png";
import founders from "@/assets/brand/founders.jpg";
import shopifyPartner from "@/assets/brand/shopify-partner.png";
import tiktokPartner from "@/assets/brand/tiktok-partner.png";
import { ApplyStepOne } from "@/components/hiring/ApplyStepOne";
import { BrandLogo } from "@/components/hiring/BrandLogo";
import { FadeUp } from "@/components/Reveal";
import { faq, faqTitle, hiring, process, roles, why } from "@/content/hiring";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Join The Selling System · Setters, Closers, Outbound",
  description: `Now hiring DM/Phone Setters, Closers and Outbound Sales Specialists at Dark Mattr. Fully remote. ${hiring.sub}`,
  openGraph: { title: "You sell. We bring the buyers. · Dark Mattr is hiring", description: hiring.subhead },
};

const NAV = [
  { label: "Roles", href: "#roles" },
  { label: "Why Us?", href: "#why" },
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="mt-0.5 size-5 shrink-0 text-flare">
      <path d="M4 10.5l3.6 3.6L16 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={`size-5 shrink-0 text-flare ${className}`}>
      <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const wrap = "container-x mx-auto w-full max-w-[1280px]";
const h2 = "display text-[clamp(1.9rem,4vw,2.75rem)]";

export default function SellingSystemHiring() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] border-b border-line bg-void/85 backdrop-blur-md">
        <div className={`${wrap} flex h-16 items-center justify-between gap-6 md:h-20`}>
          <a href={site.url} aria-label="Dark Mattr home" className="shrink-0">
            <BrandLogo priority className="h-7 w-auto md:h-9" />
          </a>
          <nav aria-label="Page sections" className="hidden items-center gap-9 text-[1.05rem] lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-bone/90 transition-colors hover:text-flare">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#apply" className="dm-btn min-h-11 px-5 py-2.5 text-[0.95rem]">
            Apply Now
          </a>
        </div>
      </header>

      <main>
        {/* Hero: centred, uppercase, as on darkmattr.co */}
        <section className={`${wrap} relative pb-12 pt-32 text-center md:pb-24 md:pt-48`}>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(127,255,0,0.09),transparent)]"
          />
          <FadeUp className="relative">
            <span className="dm-chip">
              <span className="pulse-dot size-2 rounded-full bg-flare" />
              {hiring.tag}
            </span>
            <h1 className="display mx-auto mt-8 text-[clamp(2.4rem,6vw,4.5rem)]">
              <span className="block">{hiring.headline.lineOne}</span>
              <span className="block">
                {hiring.headline.lineTwo}{" "}
                <span className="text-flare underline decoration-[0.07em] underline-offset-[0.14em]">{hiring.headline.accent}</span>
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-[30ch] text-[clamp(1.2rem,2.4vw,2rem)] font-bold leading-snug">{hiring.subhead}</p>
            <p className="mx-auto mt-5 max-w-xl text-lg text-bone/80 md:text-xl">{hiring.sub}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="#apply" className="dm-btn">
                {hiring.primaryCta}
              </a>
              <a href="#roles" className="dm-btn-dark">
                {hiring.secondaryCta}
              </a>
            </div>
            <p className="mt-4 text-sm text-bone/60">{hiring.note}</p>
          </FadeUp>
        </section>

        {/* Meet the founders */}
        <section className={`${wrap} grid items-center gap-10 py-10 md:py-20 lg:grid-cols-2 lg:gap-16`}>
          <FadeUp className="dm-raised overflow-hidden rounded-[1.25rem]">
            <Image
              src={founders}
              alt="Aal & Mo, the founders of Dark Mattr, in the Dark Mattr office"
              placeholder="blur"
              sizes="(min-width: 1024px) 600px, 100vw"
              className="h-auto w-full"
            />
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className={h2}>{hiring.founders.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-bone/85">{hiring.founders.body}</p>
            <p className="mt-4 text-lg leading-relaxed text-bone/85">{hiring.about}</p>
            <a href="#apply" className="dm-btn-dark mt-8">
              {hiring.founders.cta}
            </a>
          </FadeUp>
        </section>

        {/* Roles */}
        <section id="roles" className={`${wrap} scroll-mt-20 py-20 md:py-28`}>
          <div className="text-center">
            <p className="dm-eyebrow">{hiring.rolesIntro.eyebrow}</p>
            <h2 className={`${h2} mt-3`}>{hiring.rolesIntro.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-bone/80">{hiring.rolesIntro.sub}</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {roles.map((r, i) => (
              <FadeUp key={r.id} delay={i * 0.08} className="dm-raised flex flex-col rounded-[1.5rem] p-7 md:p-8">
                <span className="text-sm font-extrabold text-flare">0{i + 1}</span>
                <h3 className="mt-3 text-2xl font-extrabold uppercase leading-tight md:text-[1.6rem]">{r.title}</h3>
                <p className="mt-2 font-semibold text-flare">{r.tagline}</p>
                <p className="mt-4 text-bone/80">{r.summary}</p>
                <h4 className="mt-7 text-xs font-bold uppercase tracking-[0.08em] text-bone/70">You&rsquo;ll</h4>
                <ul className="mt-3 space-y-2.5">
                  {r.youWill.map((x) => (
                    <li key={x} className="flex gap-3 text-[0.95rem] text-bone/90">
                      <Check />
                      {x}
                    </li>
                  ))}
                </ul>
                <h4 className="mt-6 text-xs font-bold uppercase tracking-[0.08em] text-bone/70">We look for</h4>
                <ul className="mt-3 space-y-2.5">
                  {r.weLookFor.map((x) => (
                    <li key={x} className="flex gap-3 text-[0.95rem] text-bone/90">
                      <Check />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="flex-1" />
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-5">
                  <span className="text-sm text-bone/70">{r.comp}</span>
                  <a href="#apply" className="dm-btn-dark min-h-11 shrink-0 px-5 py-2.5 text-sm">
                    Apply
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Results, as on darkmattr.co */}
        <section className="bg-ink py-20 md:py-28">
          <div className={`${wrap} grid items-center gap-12 lg:grid-cols-2`}>
            <FadeUp className="text-center">
              <h2 className={h2}>{hiring.results.title}</h2>
              <p className="mt-4 text-xl text-bone/85">{hiring.results.sub}</p>
              <a href="#apply" className="dm-btn mt-8">
                {hiring.primaryCta}
              </a>
              <p className="mt-3 text-sm text-bone/60">{hiring.note}</p>
            </FadeUp>
            <dl className="grid gap-5 sm:grid-cols-2">
              {hiring.results.stats.map((s, i) => (
                <FadeUp key={s.label} delay={i * 0.06} className="dm-raised rounded-2xl p-6">
                  <dt className="text-lg font-bold">{s.label}</dt>
                  <dd className="mt-1 text-[2rem] font-extrabold leading-tight text-flare">{s.value}</dd>
                </FadeUp>
              ))}
            </dl>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="container-x mx-auto w-full max-w-[1100px] scroll-mt-20 py-20 md:py-28">
          <div className="text-center">
            <h2 className="text-[clamp(1.8rem,3vw,2.25rem)] font-bold text-flare">{why.title}</h2>
            <p className="mt-1 text-lg">{why.aside}</p>
          </div>
          <ul className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {why.points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <Check />
                <div>
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-1 text-bone/80">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Process */}
        <section id="process" className="scroll-mt-20 bg-ink py-20 md:py-28">
          <div className={wrap}>
            <h2 className={`${h2} text-center`}>{process.title}</h2>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {process.steps.map((s) => (
                <li key={s.n} className="dm-raised rounded-2xl p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-4xl font-extrabold text-flare">{s.n}</span>
                    <span className="dm-chip px-3 py-1 text-xs">{s.time}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-bone/80">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* As seen on + partners */}
        <section className="container-x mx-auto w-full max-w-[1100px] py-16 text-center md:py-24">
          <h2 className="text-[clamp(1.6rem,2.6vw,2rem)] font-bold">{hiring.trust.seenOn}</h2>
          <Image
            src={asSeenOn}
            alt="As seen on CBS, NBC, USA Today, Fox News, VDL News, Times Now, Daily Times Leader and Sawt Beirut International"
            sizes="(min-width: 768px) 720px, 100vw"
            className="mx-auto mt-8 h-auto w-full max-w-[720px]"
          />
          <h2 className="mt-16 text-[clamp(1.6rem,2.6vw,2rem)] font-bold">{hiring.trust.partners}</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            <Image src={shopifyPartner} alt="Shopify Partner" sizes="120px" className="h-20 w-auto" />
            <Image src={tiktokPartner} alt="TikTok Marketing Partners" sizes="220px" className="h-16 w-auto" />
          </div>
        </section>

        {/* Apply: step 1 */}
        <section id="apply" className="scroll-mt-20 bg-ink py-20 md:py-28">
          <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16`}>
            <div className="lg:pt-6">
              <p className="dm-eyebrow">Apply</p>
              <h2 className="display mt-3 text-[clamp(2.2rem,4.6vw,3.5rem)]">
                {hiring.apply.title.lead} <span className="text-flare">{hiring.apply.title.accent}</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/85">{hiring.apply.body}</p>
              <ol className="mt-10 space-y-4">
                {hiring.apply.steps.map((t, i) => (
                  <li key={t} className="flex items-center gap-4 text-bone/90">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-flare to-plasma text-sm font-extrabold text-void">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <ApplyStepOne />
          </div>
        </section>

        {/* FAQ: cards with chevrons, as on darkmattr.co */}
        <section id="faq" className="container-x mx-auto w-full max-w-[1100px] scroll-mt-20 py-20 md:py-28">
          <h2 className="text-center text-[clamp(1.8rem,3vw,2.25rem)] font-bold">{faqTitle}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 md:items-start">
            {faq.map((f) => (
              <details key={f.q} className="dm-raised group rounded-2xl px-6 py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Chevron className="transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-bone/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className={`${wrap} flex flex-col items-center gap-8 py-12 text-center md:flex-row md:justify-between md:text-left`}>
          <BrandLogo className="h-9 w-auto" />
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-bone/80">
            <a href={`mailto:${site.email}`} className="hover:text-flare">
              {site.email}
            </a>
            <span>{site.location}</span>
            <a href={`${site.url}/terms`} className="hover:text-flare">
              Terms
            </a>
          </div>
          <a href="#apply" className="dm-btn">
            Apply Now
          </a>
        </div>
        <p className="pb-8 text-center text-sm text-bone/60">
          © {new Date().getFullYear()} {site.name} · {hiring.brand}
        </p>
      </footer>
    </>
  );
}
