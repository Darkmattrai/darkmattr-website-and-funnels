import type { Metadata } from "next";
import Image from "next/image";
import asSeenOn from "@/assets/brand/as-seen-on.png";
import founders from "@/assets/brand/founders.jpg";
import shopifyPartner from "@/assets/brand/shopify-partner.png";
import tiktokPartner from "@/assets/brand/tiktok-partner.png";
import { ApplyStepOne } from "@/components/hiring/ApplyStepOne";
import { BrandLogo } from "@/components/hiring/BrandLogo";
import { FadeUp, RevealText, SectionLabel } from "@/components/Reveal";
import { faq, faqTitle, hiring, process, roles, why } from "@/content/hiring";
import { site } from "@/content/site";

const shareTitle = "You sell. We bring the buyers. · The Selling System";

export const metadata: Metadata = {
  title: "Join The Selling System · Setters, Closers, Outbound",
  description: `${hiring.about} Now hiring DM/Phone Setters, Closers and Outbound Sales Specialists. Remote.`,
  alternates: { canonical: "/selling-system" },
  openGraph: { title: shareTitle, description: hiring.sub, url: "/selling-system", siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image", title: shareTitle, description: hiring.sub },
};

const pill =
  "group inline-flex items-center gap-3 rounded-full bg-flare py-3.5 pl-6 pr-3.5 font-medium text-void transition-colors hover:bg-bone";
const pillArrow = "grid size-7 place-items-center rounded-full bg-void text-bone transition-transform duration-500 group-hover:rotate-[-45deg]";

function HiringNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[70] bg-void/60 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href={site.url} className="flex items-center gap-2.5 text-[0.95rem] tracking-tight">
          <BrandLogo priority className="h-5 w-auto md:h-6" />
          <span className="hidden text-bone/50 sm:inline">· The Selling System</span>
        </a>
        <a href="#apply" className="flex min-h-11 items-center gap-2 rounded-full bg-bone px-4 py-2 text-[0.85rem] font-medium text-void transition-colors hover:bg-flare">
          <span className="pulse-dot size-1.5 rounded-full bg-green-500" />
          Apply now
        </a>
      </div>
    </header>
  );
}

export default function SellingSystemHiring() {
  return (
    <>
      <HiringNav />
      <main>
        {/* Hero */}
        <section className="container-x relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
            <div>
              <SectionLabel>{hiring.eyebrow}</SectionLabel>
              <h1 className="display mt-8 text-[clamp(3rem,7.4vw,8.25rem)]">
                <RevealText text={hiring.headline.lineOne} as="span" className="block" />
                <RevealText text={hiring.headline.lineTwo} as="span" className="block" delay={0.15} accent={[hiring.headline.accent]} />
              </h1>
              <FadeUp delay={0.3} className="mt-10 max-w-[36rem]">
                <p className="text-lg leading-relaxed text-bone/75 md:text-xl">{hiring.sub}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#apply" className={pill}>
                    {hiring.primaryCta}
                    <span className={pillArrow}>→</span>
                  </a>
                  <a href="#roles" className="inline-flex items-center rounded-full border border-bone/20 px-6 py-3.5 font-medium transition-colors hover:border-bone/60">
                    {hiring.secondaryCta}
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* How a deal moves: where each seat sits in the system */}
            <FadeUp delay={0.2} className="relative mx-auto w-full max-w-[560px] lg:mr-0">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,91,46,0.16),rgba(139,92,255,0.07)_55%,transparent)]"
              />
              <div className="relative rounded-[2rem] border border-line bg-panel/70 p-7 backdrop-blur-md md:p-9">
                <SectionLabel>{hiring.system.label}</SectionLabel>
                <ol className="mt-8">
                  {hiring.system.steps.map((s, i, all) => {
                    const last = i === all.length - 1;
                    return (
                      <li key={s.title} className="relative flex gap-5 pb-7 last:pb-0">
                        {!last && <span aria-hidden className="absolute bottom-0 left-[1.125rem] top-10 w-px bg-gradient-to-b from-flare/60 to-plasma/30" />}
                        <span
                          className={`label grid size-9 shrink-0 place-items-center rounded-full border ${
                            last ? "border-flare bg-flare !text-void" : "border-line bg-void !text-bone"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <div className="pt-1">
                          <p className="text-lg font-medium tracking-tight md:text-xl">{s.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-bone/65 md:text-base">{s.body}</p>
                          {s.seat && (
                            <span className="mt-3 inline-flex rounded-full border border-flare/35 px-3 py-1 text-xs font-medium text-flare">{s.seat}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <a href="#roles" className="group mt-8 flex items-center justify-between border-t border-line pt-5 text-sm font-medium">
                  {hiring.system.cta}
                  <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.45} className="relative mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-16 lg:max-w-3xl">
            {hiring.proof.map((p) => (
              <div key={p.label} className="flex items-baseline gap-3 border-l border-line pl-4 sm:block">
                <div className="display text-gradient text-3xl md:text-4xl">{p.value}</div>
                <p className="text-xs text-bone/55 sm:mt-2 md:text-sm">{p.label}</p>
              </div>
            ))}
          </FadeUp>
        </section>

        {/* About */}
        <section className="container-x border-t border-line py-16 md:py-24">
          <p className="display max-w-[28ch] text-[clamp(1.6rem,3.6vw,3.2rem)] !leading-[1.08] text-bone/90">{hiring.about}</p>
        </section>

        {/* Roles */}
        <section id="roles" className="container-x scroll-mt-20 py-20 md:py-28">
          <SectionLabel>{hiring.rolesIntro.label}</SectionLabel>
          <RevealText as="h2" text={hiring.rolesIntro.title} className="display mt-8 text-[clamp(2.4rem,6vw,6rem)]" accent={[hiring.rolesIntro.accent]} />
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {roles.map((r, i) => (
              <FadeUp key={r.id} delay={i * 0.08} className="flex flex-col rounded-[2rem] border border-line bg-panel/50 p-7 md:p-9">
                <span className="label">0{i + 1}</span>
                <h3 className="display mt-4 text-3xl md:text-4xl">{r.title}</h3>
                <p className="mt-2 font-serif text-2xl italic text-flare">{r.tagline}</p>
                <p className="mt-5 text-bone/70">{r.summary}</p>
                <p className="label mt-7">You&rsquo;ll</p>
                <ul className="mt-3 space-y-2 text-sm text-bone/80">
                  {r.youWill.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-flare" />
                      {x}
                    </li>
                  ))}
                </ul>
                <p className="label mt-6">We look for</p>
                <ul className="mt-3 space-y-2 text-sm text-bone/80">
                  {r.weLookFor.map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-plasma" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                  <span className="text-sm text-bone/60">{r.comp}</span>
                  <a href="#apply" className="-my-3 -mr-3 py-3 pr-3 pl-3 text-sm font-medium underline-offset-4 hover:underline">
                    Apply →
                  </a>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Founders and results */}
        <section className="container-x grid items-center gap-12 border-t border-line py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <FadeUp className="rounded-[2rem] border border-line bg-panel/50 p-2">
            <Image
              src={founders}
              alt="Aal & Mo, the founders of Dark Mattr, in the Dark Mattr office"
              placeholder="blur"
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full rounded-[1.6rem]"
            />
          </FadeUp>
          <div>
            <SectionLabel>{hiring.founders.label}</SectionLabel>
            <RevealText as="h2" text={hiring.founders.title} className="display mt-8 text-[clamp(2.4rem,5.2vw,5.25rem)]" accent={[hiring.founders.accent]} />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone/70">{hiring.founders.body}</p>
            <dl className="mt-10 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2">
              {hiring.founders.stats.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-4 bg-void px-5 py-4 sm:flex-col-reverse sm:justify-end sm:p-6">
                  <dt className="text-sm text-bone/55 sm:mt-2">{s.label}</dt>
                  <dd className="display text-gradient text-2xl sm:text-[clamp(1.75rem,2.6vw,2.4rem)]">{s.value}</dd>
                </div>
              ))}
            </dl>
            <a href="#apply" className={`${pill} mt-9`}>
              {hiring.founders.cta}
              <span className={pillArrow}>→</span>
            </a>
          </div>
        </section>

        {/* Why */}
        <section className="bg-ink py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <SectionLabel>{why.title}</SectionLabel>
              <h2 className="display mt-8 text-[clamp(2.2rem,5vw,5rem)]">
                {why.heading.lead} <span className="font-serif font-normal italic tracking-[-0.02em] text-gradient">{why.heading.accent}</span>
              </h2>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-[2rem] border border-line bg-line sm:grid-cols-2">
              {why.points.map((p) => (
                <li key={p.title} className="bg-ink p-7">
                  <h3 className="text-xl font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-bone/65">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process */}
        <section className="container-x py-20 md:py-28">
          <SectionLabel>{process.title}</SectionLabel>
          <ol className="mt-12 grid gap-4 md:grid-cols-4">
            {process.steps.map((s) => (
              <li key={s.n} className="rounded-[1.5rem] border border-line p-6">
                <div className="flex items-baseline justify-between">
                  <span className="display text-5xl text-transparent [-webkit-text-stroke:1px_rgba(239,238,233,0.3)]">{s.n}</span>
                  <span className="label">{s.time}</span>
                </div>
                <h3 className="mt-4 text-xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-2 text-bone/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Press and partners */}
        <section className="container-x grid items-center gap-12 border-t border-line py-16 md:py-20 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            <SectionLabel>{hiring.trust.seenOn}</SectionLabel>
            <Image
              src={asSeenOn}
              alt="As seen on CBS, NBC, USA Today, Fox News, VDL News, Times Now, Daily Times Leader and Sawt Beirut International"
              sizes="(min-width: 1024px) 620px, 100vw"
              className="mt-8 h-auto w-full max-w-[620px] opacity-80"
            />
          </div>
          <div>
            <SectionLabel>{hiring.trust.partners}</SectionLabel>
            <div className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
              <Image src={shopifyPartner} alt="Shopify Partner" sizes="96px" className="h-20 w-auto opacity-90" />
              <Image src={tiktokPartner} alt="TikTok Marketing Partners" sizes="180px" className="h-16 w-auto opacity-90" />
            </div>
          </div>
        </section>

        {/* Apply: step 1 */}
        <section id="apply" className="relative scroll-mt-16 overflow-hidden bg-ink py-20 md:py-28">
          <div className="pointer-events-none absolute -bottom-1/3 left-1/2 size-[90vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,91,46,0.14),rgba(139,92,255,0.08)_35%,transparent_60%)]" />
          <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <SectionLabel>{hiring.apply.label}</SectionLabel>
              <RevealText as="h2" text={hiring.apply.title} className="display mt-8 text-[clamp(2.6rem,7vw,7rem)]" accent={[hiring.apply.accent]} />
              <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/65">{hiring.apply.body}</p>
              <ol className="mt-10 space-y-4">
                {hiring.apply.steps.map((t, i) => (
                  <li key={t} className="flex items-center gap-4 text-bone/80">
                    <span className="label grid size-9 shrink-0 place-items-center rounded-full border border-line">0{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <ApplyStepOne />
          </div>
        </section>

        {/* FAQ */}
        <section className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionLabel>{faqTitle}</SectionLabel>
          </div>
          <dl className="border-t border-line">
            {faq.map((f) => (
              <div key={f.q} className="border-b border-line py-6">
                <dt className="text-xl font-medium tracking-tight">{f.q}</dt>
                <dd className="mt-2 max-w-2xl text-bone/65">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <footer className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-bone/55">
        <span>© {new Date().getFullYear()} {site.name} · The Selling System</span>
        <a href={`mailto:${site.email}`} className="hover:text-bone">
          {site.email}
        </a>
      </footer>
    </>
  );
}
