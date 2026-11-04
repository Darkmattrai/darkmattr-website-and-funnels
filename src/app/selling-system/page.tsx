import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import asSeenOn from "@/assets/brand/as-seen-on.png";
import founders from "@/assets/brand/founders.jpg";
import shopifyPartner from "@/assets/brand/shopify-partner.png";
import tiktokPartner from "@/assets/brand/tiktok-partner.png";
import check from "@/assets/clay/check.webp";
import heroScene from "@/assets/clay/hero.webp";
import megaphone from "@/assets/clay/megaphone.webp";
import phone from "@/assets/clay/phone.webp";
import planet from "@/assets/clay/planet.webp";
import trophy from "@/assets/clay/trophy.webp";
import { ApplyStepOne } from "@/components/hiring/ApplyStepOne";
import { BrandLogo } from "@/components/hiring/BrandLogo";
import { FadeUp } from "@/components/Reveal";
import { faq, faqTitle, hiring, process, roles, why, type Role } from "@/content/hiring";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Join The Selling System · Setters, Closers, Outbound",
  description: `Now hiring DM/Phone Setters, Closers and Outbound Sales Specialists at Dark Mattr. Fully remote. ${hiring.sub}`,
  openGraph: { title: "You sell. We bring the buyers. · Dark Mattr is hiring", description: hiring.subhead },
};

const NAV = [
  { label: "Roles", href: "#roles" },
  { label: "Why us?", href: "#why" },
  { label: "How it works", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

const PROP: Record<Role["id"], { src: StaticImageData; alt: string }> = {
  setter: { src: phone, alt: "A clay phone with a chat bubble" },
  closer: { src: trophy, alt: "A clay trophy" },
  outbound: { src: megaphone, alt: "A clay megaphone" },
};
const TILT = ["lg:-rotate-[1.5deg]", "lg:rotate-1", "lg:-rotate-[0.75deg]"];
const BALLS = ["", "clay-ball-sun", "clay-ball-grass", "clay-ball-sky"];

/** Letters that bounce on the baseline, like hand-placed clay letters. */
function Bouncy({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span aria-hidden className={`bounce ${className}`}>
      {[...text].map((ch, i) => (
        <span key={i}>{ch === " " ? " " : ch}</span>
      ))}
    </span>
  );
}

function CheckIcon({ className = "h-5 w-auto" }: { className?: string }) {
  return <Image src={check} alt="" sizes="48px" className={`mt-0.5 shrink-0 ${className}`} />;
}

const wrap = "container-x mx-auto w-full max-w-[1240px]";
const eyebrow = "text-sm font-extrabold uppercase tracking-[0.14em]";
const h2 = "clay-type text-[clamp(2.4rem,5vw,4rem)]";
const deepTangerine = "text-[#b4510a]";

export default function SellingSystemHiring() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] bg-putty/85 backdrop-blur-md">
        <div className={`${wrap} flex h-16 items-center justify-between gap-6 md:h-20`}>
          <a href={site.url} aria-label="Dark Mattr home" className="shrink-0">
            <BrandLogo priority />
          </a>
          <nav aria-label="Page sections" className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="font-display text-xl uppercase tracking-wide underline-offset-[6px] hover:underline">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#apply" className="clay-btn clay-btn-sm">
            Apply now
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={`${wrap} relative grid items-center gap-6 pb-20 pt-28 md:pt-36 lg:grid-cols-[1.08fr_1fr] lg:gap-0 lg:pb-28`}>
          <div className="relative z-10">
            <span className="clay-chip">
              <span className="clay-ball clay-ball-grass size-3.5" />
              {hiring.tag}
            </span>
            <h1 className="boil mt-7 text-[clamp(3rem,6.2vw,5.5rem)] leading-[0.95]">
              <span className="sr-only">
                {hiring.headline.lineOne} {hiring.headline.lineTwo} {hiring.headline.accent}
              </span>
              <span aria-hidden className="clay-type block">
                {hiring.headline.lineOne}
              </span>
              <span aria-hidden className="clay-type block">
                {hiring.headline.lineTwo}
              </span>
              <Bouncy text={hiring.headline.accent} className="clay-type clay-type-tangerine block" />
            </h1>
            <p className="mt-7 max-w-[32ch] text-xl font-bold leading-snug md:text-2xl">{hiring.subhead}</p>
            <p className="mt-4 max-w-md text-lg font-medium text-bone/80">{hiring.sub}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#apply" className="clay-btn">
                {hiring.primaryCta}
              </a>
              <a href="#roles" className="clay-btn clay-btn-light">
                {hiring.secondaryCta}
              </a>
            </div>
            <p className="mt-5 text-sm font-semibold text-bone/75">{hiring.note}</p>
          </div>
          <div className="relative">
            <span aria-hidden className="clay-ball clay-ball-sun clay-bob absolute right-[6%] top-[-6%] size-24 md:size-36" />
            <span aria-hidden className="clay-ball clay-ball-berry clay-bob absolute bottom-[8%] left-[4%] size-7 [animation-delay:-1s]" />
            <span aria-hidden className="clay-ball clay-ball-sky clay-bob absolute left-[30%] top-[2%] size-5 [animation-delay:-0.5s]" />
            <Image
              src={heroScene}
              alt="A clay magnet pulling a stream of little clay buyers and coins towards it"
              priority
              sizes="(min-width: 1024px) 760px, 100vw"
              className="relative h-auto w-full lg:w-[112%] lg:max-w-none"
            />
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="band band-sun scroll-mt-20 py-20 md:py-28">
          <div className={wrap}>
            <div className="text-center">
              <p className={eyebrow}>{hiring.rolesIntro.eyebrow}</p>
              <h2 className={`${h2} mt-3`}>{hiring.rolesIntro.title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg font-semibold">{hiring.rolesIntro.sub}</p>
            </div>
            <div className="mt-28 grid gap-x-7 gap-y-28 lg:grid-cols-3">
              {roles.map((r, i) => (
                <FadeUp key={r.id} delay={i * 0.08} className={`clay-card relative flex flex-col px-7 pb-8 pt-24 md:px-8 ${TILT[i]}`}>
                  <Image
                    src={PROP[r.id].src}
                    alt={PROP[r.id].alt}
                    sizes="240px"
                    className={`clay-bob absolute -top-20 left-1/2 h-40 w-auto -translate-x-1/2 ${i === 1 ? "[animation-delay:-0.8s]" : i === 2 ? "[animation-delay:-1.6s]" : ""}`}
                  />
                  <span className={`${eyebrow} ${deepTangerine}`}>Seat 0{i + 1}</span>
                  <h3 className="clay-type clay-type-sm mt-2 text-[2rem] leading-none">{r.title}</h3>
                  <p className={`mt-3 font-bold ${deepTangerine}`}>{r.tagline}</p>
                  <p className="mt-3 text-bone/85">{r.summary}</p>
                  <h4 className="mt-6 text-xs font-extrabold uppercase tracking-[0.12em] text-bone/80">You&rsquo;ll</h4>
                  <ul className="mt-3 space-y-2.5">
                    {r.youWill.map((x) => (
                      <li key={x} className="flex gap-3 text-[0.95rem] font-medium">
                        <CheckIcon />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-6 text-xs font-extrabold uppercase tracking-[0.12em] text-bone/80">We look for</h4>
                  <ul className="mt-3 space-y-2.5">
                    {r.weLookFor.map((x) => (
                      <li key={x} className="flex gap-3 text-[0.95rem] font-medium">
                        <CheckIcon />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="flex-1" />
                  <div className="mt-8 flex items-center justify-between gap-4 border-t-2 border-dashed border-[#e4d5bd] pt-5">
                    <span className="text-sm font-semibold text-bone/80">{r.comp}</span>
                    <a href="#apply" className="clay-btn clay-btn-sm shrink-0">
                      Apply
                    </a>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the founders */}
        <section className={`${wrap} grid items-center gap-14 py-24 md:py-32 lg:grid-cols-2 lg:gap-16`}>
          <FadeUp className="relative lg:-rotate-2">
            <div className="clay-card p-3 md:p-4">
              <Image
                src={founders}
                alt="Aal & Mo, the founders of Dark Mattr, in the Dark Mattr office"
                placeholder="blur"
                sizes="(min-width: 1024px) 580px, 100vw"
                className="h-auto w-full rounded-[22px]"
              />
            </div>
            <Image src={planet} alt="" sizes="160px" className="clay-wiggle absolute right-0 -top-12 w-28 md:-right-10 md:w-40" />
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className={h2}>{hiring.founders.title}</h2>
            <p className="mt-6 text-lg font-medium leading-relaxed">{hiring.founders.body}</p>
            <p className="mt-4 text-lg font-medium leading-relaxed text-bone/85">{hiring.about}</p>
            <a href="#apply" className="clay-btn clay-btn-sun mt-9">
              {hiring.founders.cta}
            </a>
          </FadeUp>
        </section>

        {/* Results */}
        <section className="band band-sky py-20 md:py-28">
          <div className={`${wrap} grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]`}>
            <FadeUp className="text-center lg:text-left">
              <h2 className={h2}>{hiring.results.title}</h2>
              <p className="mt-4 text-xl font-bold">{hiring.results.sub}</p>
              <a href="#apply" className="clay-btn mt-9">
                {hiring.primaryCta}
              </a>
            </FadeUp>
            <dl className="grid gap-6 sm:grid-cols-2">
              {hiring.results.stats.map((s, i) => (
                <FadeUp key={s.label} delay={i * 0.06} className={`clay-card px-6 py-6 ${i % 2 ? "sm:rotate-1" : "sm:-rotate-1"}`}>
                  <dt className="font-bold">{s.label}</dt>
                  <dd className="clay-type clay-type-sm mt-2 text-[clamp(2.1rem,3.4vw,2.75rem)] leading-none">{s.value}</dd>
                </FadeUp>
              ))}
            </dl>
          </div>
        </section>

        {/* Why */}
        <section id="why" className="container-x mx-auto w-full max-w-[1100px] scroll-mt-20 py-24 md:py-32">
          <div className="text-center">
            <h2 className={h2}>{why.title}</h2>
            <p className="mt-3 text-lg font-bold">{why.aside}</p>
          </div>
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {why.points.map((p) => (
              <li key={p.title} className="clay-card flex gap-5 p-6 md:p-7">
                <CheckIcon className="h-11 w-auto" />
                <div>
                  <h3 className="text-xl font-extrabold">{p.title}</h3>
                  <p className="mt-1.5 font-medium text-bone/85">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Process */}
        <section id="process" className={`${wrap} scroll-mt-20 pb-28 md:pb-36`}>
          <h2 className={`${h2} text-center`}>{process.title}</h2>
          <ol className="relative mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            <svg aria-hidden viewBox="0 0 1000 40" preserveAspectRatio="none" className="pointer-events-none absolute left-[12%] right-[12%] top-0 hidden h-10 w-[76%] text-bone/50 lg:block">
              <path className="doodle" vectorEffect="non-scaling-stroke" strokeDasharray="1 14" strokeWidth="5" d="M0 22 C 120 2, 220 40, 333 20 S 560 2, 666 22 S 880 40, 1000 18" />
            </svg>
            {process.steps.map((s, i) => (
              <li key={s.n} className="clay-card relative px-6 pb-7 pt-14 text-center">
                <span className={`clay-ball ${BALLS[i]} absolute -top-9 left-1/2 size-[4.5rem] -translate-x-1/2 text-[2.2rem]`}>{i + 1}</span>
                <span className="clay-chip px-3 py-1 text-xs">{s.time}</span>
                <h3 className="clay-type clay-type-sm mt-4 text-[1.75rem]">{s.title}</h3>
                <p className="mt-2 font-medium text-bone/85">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* As seen on + partners */}
        <section className="band band-plum py-20 text-center md:py-24">
          <div className="container-x mx-auto w-full max-w-[1100px]">
            <h2 className="clay-type clay-type-chalk text-[clamp(2rem,3.6vw,3rem)]">{hiring.trust.seenOn}</h2>
            <Image
              src={asSeenOn}
              alt="As seen on CBS, NBC, USA Today, Fox News, VDL News, Times Now, Daily Times Leader and Sawt Beirut International"
              sizes="(min-width: 768px) 720px, 100vw"
              className="mx-auto mt-10 h-auto w-full max-w-[720px]"
            />
            <h2 className="clay-type clay-type-chalk mt-16 text-[clamp(2rem,3.6vw,3rem)]">{hiring.trust.partners}</h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              <Image src={shopifyPartner} alt="Shopify Partner" sizes="120px" className="h-20 w-auto" />
              <Image src={tiktokPartner} alt="TikTok Marketing Partners" sizes="220px" className="h-16 w-auto" />
            </div>
          </div>
        </section>

        {/* Apply: step 1 */}
        <section id="apply" className="band band-tangerine scroll-mt-20 py-24 md:py-32">
          <div className={`${wrap} grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16`}>
            <div className="lg:pt-8">
              <p className={eyebrow}>Apply</p>
              <h2 className="clay-type mt-3 text-[clamp(2.8rem,5.6vw,4.75rem)]">
                {hiring.apply.title.lead} <Bouncy text={hiring.apply.title.accent} className="clay-type clay-type-chalk clay-outline" />
                <span className="sr-only">{hiring.apply.title.accent}</span>
              </h2>
              <p className="mt-6 max-w-md text-lg font-semibold">{hiring.apply.body}</p>
              <ol className="mt-10 space-y-5">
                {hiring.apply.steps.map((t, i) => (
                  <li key={t} className="flex items-center gap-4 text-lg font-bold">
                    <span className="clay-ball clay-ball-chalk size-12 shrink-0 text-2xl">{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
            <ApplyStepOne />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="container-x mx-auto w-full max-w-[1100px] scroll-mt-20 py-24 md:py-32">
          <h2 className={`${h2} text-center`}>{faqTitle}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 md:items-start">
            {faq.map((f) => (
              <details key={f.q} className="clay-card group px-6 py-5">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="clay-ball clay-ball-sun size-9 shrink-0 text-xl transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 font-medium leading-relaxed text-bone/85">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="band band-plum mt-8 [&::after]:hidden">
        <div className={`${wrap} flex flex-col items-center gap-8 py-14 text-center md:flex-row md:justify-between md:text-left`}>
          <BrandLogo tone="cream" size="lg" />
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 font-semibold text-chalk/90">
            <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
              {site.email}
            </a>
            <span>{site.location}</span>
            <a href={`${site.url}/terms`} className="underline-offset-4 hover:underline">
              Terms
            </a>
          </div>
          <a href="#apply" className="clay-btn clay-btn-sun">
            Apply now
          </a>
        </div>
        <p className="pb-8 text-center text-sm font-medium text-chalk/80">
          © {new Date().getFullYear()} {site.name} · {hiring.brand}
        </p>
      </footer>
    </>
  );
}
