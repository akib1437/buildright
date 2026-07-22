import Reveal from "@/components/Reveal";
import { LOCALE, SERVICE_AREAS } from "@/lib/locale";
import { SITE } from "@/lib/constants";

export default function AreasServed() {
  return (
    <section id="service-area" className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] items-start">
          <Reveal>
            <div>
              <div className="dim-line dim-line--tick dim-line--amber max-w-[240px]">
                <span>service area & project types</span>
              </div>
              <h2 className="mt-5 font-display font-black tracking-tight text-4xl sm:text-5xl leading-[0.95]">
                Serving the <span className="text-amber">{LOCALE.regionShort}</span> area.
              </h2>
              <p className="mt-5 text-paper/60 max-w-md">
                {SITE.name} handles residential and commercial work. Contact the team to
                confirm availability for your job location.
              </p>
            </div>
          </Reveal>
          <Reveal delay="2">
            <ul className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((area) => (
                <li
                  key={area}
                  className="font-mono text-[0.72rem] uppercase tracking-[0.14em] px-3.5 py-2 border border-paper/20 text-paper/80 hover:border-amber hover:text-amber hover:bg-amber/10 transition-colors cursor-default"
                >
                  {area}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
