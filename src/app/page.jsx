import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Img from "@/components/Img";
import ContactForm from "@/components/ContactForm";
import { createClient } from "@/lib/supabase/server";
import { serviceModel } from "@/models/serviceModel";
import { portfolioModel } from "@/models/portfolioModel";
import { PORTFOLIO_CATEGORIES, SITE } from "@/lib/constants";

export const revalidate = 0;

const PROCESS = [
  { step: "01", title: "Book online", text: "Pick a service, a date and a time slot. Takes under a minute." },
  { step: "02", title: "Site visit", text: "A licensed tech or estimator arrives in your slot and scopes the work." },
  { step: "03", title: "Fixed quote", text: "You get a written, fixed-price quote — no surprises mid-job." },
  { step: "04", title: "Build & sign-off", text: "We build, you inspect, and the job closes only when you're happy." },
];

export default async function HomePage() {
  const supabase = createClient();
  const [services, allPortfolio] = await Promise.all([
    serviceModel.listActive(supabase),
    portfolioModel.listAll(supabase),
  ]);
  const preview = PORTFOLIO_CATEGORIES.map((c) => ({
    ...c,
    item: allPortfolio.find((p) => p.category === c.key),
    count: allPortfolio.filter((p) => p.category === c.key).length,
  }));

  return (
    <>
      <SiteHeader />
      <main>
        {/* ---------- HERO ---------- */}
        <section className="blueprint-grid text-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28 grid gap-12 md:grid-cols-[1.2fr_1fr] items-center">
            <div className="rise">
              <div className="dim-line dim-line--tick dim-line--amber max-w-xs mb-6">
                <span>est. 2011 · licensed & insured</span>
              </div>
              <h1 className="font-display font-black tracking-tight leading-[0.95] text-5xl sm:text-6xl md:text-7xl">
                Your house,
                <br />
                <span className="text-amber">measured twice.</span>
              </h1>
              <p className="mt-6 max-w-md text-paper/70 text-base sm:text-lg">
                Repairs finished in an afternoon. Kitchens and baths rebuilt to the
                millimetre. Additions drawn, permitted and raised — one crew, one contract.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/#services" className="btn-amber">Schedule a visit</Link>
                <Link href="/portfolio" className="btn-ghost-light">See finished work</Link>
              </div>
              <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md font-mono">
                {[["1,400+", "jobs closed"], ["4.9 / 5", "avg. rating"], ["10 yr", "workmanship warranty"]].map(([v, l]) => (
                  <div key={l}>
                    <dt className="sr-only">{l}</dt>
                    <dd className="text-amber text-xl">{v}</dd>
                    <dd className="text-paper/50 text-[0.62rem] uppercase tracking-[0.18em] mt-1">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative hidden md:block rise">
              <div className="border border-paper/25 p-2 bg-ink/40">
                <Img
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=70"
                  alt="Architectural plans on a drafting table"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-amber text-ink px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
                Next slot: usually within 3 days
              </div>
            </div>
          </div>
        </section>

        {/* ---------- SERVICES ---------- */}
        <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="dim-line dim-line--tick max-w-sm mx-auto">
            <span>services · pick one to schedule</span>
          </div>
          <h2 className="mt-5 text-center font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
            Three ways we work on your home
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <article key={s.slug} className="card flex flex-col p-6 hover:border-ink transition-colors">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-blueprint">{s.tagline}</p>
                <h3 className="mt-2 font-display font-bold text-xl">{s.name}</h3>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed flex-1">{s.description}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft border-t border-line pt-4">
                  <div>
                    <dt className="text-ink-soft/60">Typical cost</dt>
                    <dd className="text-ink mt-0.5">{s.price_range}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-soft/60">Duration</dt>
                    <dd className="text-ink mt-0.5">{s.duration}</dd>
                  </div>
                </dl>
                <Link href={`/schedule/${s.slug}`} className="btn-amber mt-6 w-full">
                  {s.slug === "repair" ? "Schedule repair" : s.slug === "remodel" ? "Remodel space" : "Plan addition"}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- PORTFOLIO PREVIEW ---------- */}
        <section className="bg-white border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="dim-line dim-line--tick max-w-[220px]">
                  <span>finished work</span>
                </div>
                <h2 className="mt-4 font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
                  Proof, by the room
                </h2>
              </div>
              <Link href="/portfolio" className="btn-ghost">Browse full portfolio</Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {preview.map(({ key, label, item, count }) => (
                <Link key={key} href={`/portfolio?tab=${key}`} className="group block">
                  <div className="overflow-hidden border border-line">
                    {item && (
                      <Img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-56 object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-display font-bold">{label}</span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-blueprint">
                      {count} projects →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- PROCESS ---------- */}
        <section id="process" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="dim-line dim-line--tick max-w-sm mx-auto">
            <span>how a job runs</span>
          </div>
          <h2 className="mt-5 text-center font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
            From booking to sign-off
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-4">
            {PROCESS.map((p) => (
              <li key={p.step} className="card p-6">
                <span className="font-mono text-blueprint text-sm">{p.step}</span>
                <h3 className="mt-2 font-display font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{p.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section id="contact" className="blueprint-grid text-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 grid gap-12 md:grid-cols-2">
            <div>
              <div className="dim-line dim-line--tick dim-line--amber max-w-[240px]">
                <span>questions first?</span>
              </div>
              <h2 className="mt-5 font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
                Talk to us before you book
              </h2>
              <p className="mt-4 text-paper/70 max-w-md">
                Not sure whether it's a repair or a remodel? Send a note — an estimator
                (not a sales script) replies within one business day.
              </p>
              <div className="mt-8 font-mono text-[0.72rem] uppercase tracking-[0.16em] space-y-2 text-paper/70">
                <p>{SITE.phone}</p>
                <p className="lowercase">{SITE.email}</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
