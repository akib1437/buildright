import Reveal from "@/components/Reveal";
import { FAQ_DATA, LOCALE } from "@/lib/locale";

export default function FAQ() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-24">
        <Reveal>
          <div className="dim-line dim-line--tick max-w-sm mx-auto">
            <span>frequently asked</span>
          </div>
          <h2 className="mt-5 text-center font-display font-black tracking-tight text-4xl sm:text-5xl">
            Everything customers ask before booking
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-line border-y border-line">
          {FAQ_DATA.map((item, i) => (
            <Reveal key={item.q} delay={((i % 4) + 1)}>
              <details className="group py-5 px-1">
                <summary className="flex items-start justify-between gap-6 select-none">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-blueprint tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display font-bold text-lg sm:text-xl group-hover:text-blueprint transition-colors">
                      {item.q}
                    </span>
                  </div>
                  <span aria-hidden className="accordion-caret text-2xl leading-none text-ink-soft shrink-0 mt-0.5">+</span>
                </summary>
                <p className="mt-4 ml-10 max-w-3xl text-ink-soft leading-relaxed">
                  {item.a(LOCALE)}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
