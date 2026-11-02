import { fit } from "@/content/site";
import { FadeUp, RevealText, SectionLabel } from "./Reveal";

export function Fit() {
  return (
    <section id="fit" className="container-x py-24 md:py-36">
      <SectionLabel>{fit.label}</SectionLabel>
      <RevealText
        as="h2"
        text={fit.title}
        className="display mt-8 max-w-[18ch] text-[clamp(2.4rem,5.6vw,5.6rem)]"
        accent={["point."]}
      />
      <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2">
        <FadeUp className="relative overflow-hidden rounded-[2rem] bg-bone p-8 text-void md:p-12">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(255,91,46,0.45),transparent_65%)]" />
          <p className="label !text-void/60">Pulled into orbit</p>
          <h3 className="display mt-3 text-4xl md:text-5xl">You&rsquo;re a fit if…</h3>
          <ul className="relative mt-8 space-y-4">
            {fit.yes.map((item) => (
              <li key={item} className="flex gap-4 border-t border-void/10 pt-4 text-lg leading-snug">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-void text-xs text-bone">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={0.1} className="rounded-[2rem] border border-line bg-panel/50 p-8 md:p-12">
          <p className="label">Drifting out of range</p>
          <h3 className="display mt-3 text-4xl text-bone/80 md:text-5xl">Probably not if…</h3>
          <ul className="mt-8 space-y-4">
            {fit.no.map((item) => (
              <li key={item} className="flex gap-4 border-t border-line pt-4 text-lg leading-snug text-bone/60">
                <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-line text-xs">×</span>
                {item}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
