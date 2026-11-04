import type { Metadata } from "next";
import Link from "next/link";
import { ApplyStepOne } from "@/components/hiring/ApplyStepOne";
import { LogoMark } from "@/components/Logo";
import { FadeUp, RevealText, SectionLabel } from "@/components/Reveal";
import { faq, hiring, process, roles, why } from "@/content/hiring";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Join The Selling System · Setters, Closers, Outbound",
  description: `${hiring.about} Now hiring DM/Phone Setters, Closers and Outbound Sales Specialists. Remote.`,
  openGraph: { title: "You sell. We bring the buyers. · The Selling System", description: hiring.sub },
};

function HiringNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[70] bg-void/60 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="group flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight">
          <LogoMark className="size-6 transition-transform duration-700 group-hover:rotate-[200deg]" />
          Dark Mattr <span className="hidden font-normal text-bone/50 sm:inline">· The Selling System</span>
        </Link>
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
        <section className="container-x relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
          <div className="pointer-events-none absolute -right-1/4 top-0 size-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(255,91,46,0.16),rgba(139,92,255,0.08)_35%,transparent_60%)]" />
          <div className="relative">
            <SectionLabel>{hiring.eyebrow}</SectionLabel>
            <h1 className="display mt-8 text-[clamp(3rem,9.5vw,9.5rem)]">
              <RevealText text={hiring.headline.lineOne} as="span" className="block" />
              <RevealText text={hiring.headline.lineTwo} as="span" className="block" delay={0.15} accent={["buyers."]} />
            </h1>
            <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,36rem)_1fr] md:items-end">
              <FadeUp delay={0.3}>
                <p className="text-lg leading-relaxed text-bone/75 md:text-xl">{hiring.sub}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#apply" className="group inline-flex items-center gap-3 rounded-full bg-flare py-3.5 pl-6 pr-3.5 font-medium text-void transition-colors hover:bg-bone">
                    {hiring.primaryCta}
                    <span className="grid size-7 place-items-center rounded-full bg-void text-bone transition-transform duration-500 group-hover:rotate-[-45deg]">→</span>
                  </a>
                  <a href="#roles" className="inline-flex items-center rounded-full border border-bone/20 px-6 py-3.5 font-medium transition-colors hover:border-bone/60">
                    {hiring.secondaryCta}
                  </a>
                </div>
              </FadeUp>
              <FadeUp delay={0.45} className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:justify-self-end">
                {hiring.proof.map((p) => (
                  <div key={p.label} className="flex items-baseline gap-3 border-l border-line pl-4 sm:block">
                    <div className="display text-gradient text-3xl md:text-4xl">{p.value}</div>
                    <p className="text-xs text-bone/55 sm:mt-2 md:text-sm">{p.label}</p>
                  </div>
                ))}
              </FadeUp>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="container-x border-t border-line py-16 md:py-24">
          <p className="display max-w-[28ch] text-[clamp(1.6rem,3.6vw,3.2rem)] !leading-[1.08] text-bone/90">{hiring.about}</p>
        </section>

        {/* Roles */}
        <section id="roles" className="container-x py-20 md:py-28">
          <SectionLabel>Three seats open</SectionLabel>
          <RevealText as="h2" text={"Pick the seat\nthat fits you."} className="display mt-8 text-[clamp(2.4rem,6vw,6rem)]" accent={["you."]} />
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

        {/* Why */}
        <section className="bg-ink py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <SectionLabel>{why.title}</SectionLabel>
              <h2 className="display mt-8 text-[clamp(2.2rem,5vw,5rem)]">
                Sell what people <span className="font-serif font-normal italic tracking-[-0.02em] text-gradient">already want.</span>
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

        {/* Apply: step 1 */}
        <section id="apply" className="relative overflow-hidden bg-ink py-20 md:py-28">
          <div className="pointer-events-none absolute -bottom-1/3 left-1/2 size-[90vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,91,46,0.14),rgba(139,92,255,0.08)_35%,transparent_60%)]" />
          <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <SectionLabel>Apply</SectionLabel>
              <RevealText as="h2" text={"Two steps.\nTen minutes."} className="display mt-8 text-[clamp(2.6rem,7vw,7rem)]" accent={["minutes."]} />
              <p className="mt-8 max-w-md text-lg leading-relaxed text-bone/65">
                Leave your details now. The survey comes next: eight questions about how you actually sell, one at a time, plus your resume.
              </p>
              <ol className="mt-10 space-y-4">
                {["Your details, one minute", "The survey, eight questions", "A call with our sales lead"].map((t, i) => (
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
            <SectionLabel>Before you ask</SectionLabel>
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
