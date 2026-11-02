import { forces } from "@/content/site";
import { RevealText, SectionLabel } from "./Reveal";

export function Forces() {
  return (
    <section id="forces" className="relative py-24 md:py-36">
      <div className="container-x grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <SectionLabel>Sector 02 · Forces we control</SectionLabel>
          <RevealText
            as="h2"
            text={"Six forces.\nOne gravitational pull."}
            className="display mt-8 text-[clamp(2.6rem,6.4vw,6.5rem)]"
            accent={["gravitational", "pull."]}
          />
        </div>
        <p className="max-w-md text-lg leading-relaxed text-bone/65 md:justify-self-end">
          Each one works alone. Together, they form a system that keeps pulling the right buyers toward you, month after month.
        </p>
      </div>

      <ul className="mt-16 border-t border-line md:mt-24">
        {forces.map((f) => (
          <li key={f.id} className="group relative overflow-hidden border-b border-line">
            {/* hover fill sweep: visual only, so rows never change height */}
            <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            <div
              data-cursor="Force"
              className="container-x relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-4 py-8 transition-colors duration-500 group-hover:text-void md:grid-cols-[6rem_1.1fr_1fr_auto] md:items-center md:py-11"
            >
              <span className="label pt-2 transition-colors group-hover:!text-void/60 md:pt-0">{f.id}</span>
              <h3 className="display text-[clamp(1.9rem,4.6vw,4.4rem)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-4">
                {f.title}
              </h3>
              <div className="col-start-2 md:col-start-3">
                <p className="max-w-md text-base leading-snug text-bone/60 transition-colors group-hover:text-void/75">{f.line}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-line px-3 py-1 text-xs text-bone/60 transition-colors group-hover:border-void/20 group-hover:text-void/70"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <span
                aria-hidden
                className="hidden size-14 place-items-center rounded-full border border-line text-xl transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-void group-hover:bg-void group-hover:text-bone md:grid"
              >
                →
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
