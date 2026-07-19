import Reveal from "@/components/Reveal";
import { LOCALE, SERVICE_AREAS } from "@/lib/locale";

export default function AreasServed() {
  return (
    <section className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] items-start">
          <Reveal>
            <div>
              <div className="dim-line dim-line--tick dim-line--amber max-w-[220px]">
                <span>service area</span>
              </div>
              <h2 className="mt-5 font-display font-black tracking-tight text-4xl sm:text-5xl leading-[0.95]">
                Anywhere inside <span className="text-amber">{LOCALE.regionShort}</span>, we're {LOCALE.serviceRadius} out.
              </h2>
              <p className="mt-5 text-paper/60 max-w-md">
                {SERVICE_AREAS.length} neighborhoods covered daily. If yours isn't on the list,
                message us anyway — we take bigger projects further out.
              </p>
            </div>
          </Reveal>
          <Reveal delay="2">
            <ul className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((a) => (
                <li
                  key={a}
                  className="font-mono text-[0.72rem] uppercase tracking-[0.14em] px-3.5 py-2 border border-paper/20 text-paper/80 hover:border-amber hover:text-amber hover:bg-amber/10 transition-colors cursor-default"
                >
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
