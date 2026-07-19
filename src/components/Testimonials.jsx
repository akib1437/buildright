import Reveal from "@/components/Reveal";
import { TESTIMONIALS_DATA } from "@/lib/locale";

function Stars({ n }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i < n ? "fill-amber" : "fill-paper/20"}`}>
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 grain opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <Reveal>
          <div className="dim-line dim-line--tick dim-line--amber max-w-xs">
            <span>what neighbors say</span>
          </div>
          <h2 className="mt-5 font-display font-black tracking-tight text-4xl sm:text-5xl max-w-2xl">
            The best ad we run is <span className="text-amber">someone else's mouth.</span>
          </h2>
          <p className="mt-4 text-paper/60 max-w-xl">
            Every review here is from a real customer whose job closed in the last 12 months.
            No incentives, no scripts.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS_DATA.map((r, i) => (
            <Reveal key={r.name} delay={((i % 3) + 1)}>
              <article className="h-full p-6 border border-paper/10 bg-paper/[0.03] hover:bg-paper/[0.06] hover:border-amber/40 transition-colors tilt">
                <Stars n={r.rating} />
                <p className="mt-4 text-paper/85 leading-relaxed">"{r.body}"</p>
                <div className="mt-6 pt-5 border-t border-paper/10">
                  <p className="font-display font-bold">{r.name}</p>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/50 mt-0.5">
                    {r.role}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
