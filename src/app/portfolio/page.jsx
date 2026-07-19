import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import Img from "@/components/Img";
import { createClient } from "@/lib/supabase/server";
import { portfolioModel } from "@/models/portfolioModel";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

export const revalidate = 0;
export const metadata = { title: "Portfolio — BuildRight" };

export default async function PortfolioPage({ searchParams }) {
  const active = PORTFOLIO_CATEGORIES.some((c) => c.key === searchParams?.tab)
    ? searchParams.tab
    : "kitchen";
  const supabase = createClient();
  const items = await portfolioModel.listByCategory(supabase, active);
  const activeLabel = PORTFOLIO_CATEGORIES.find((c) => c.key === active)?.label;

  return (
    <>
      <SiteHeader />
      <main>
        {/* ---------- portfolio hero ---------- */}
        <section className="relative isolate overflow-hidden bg-ink text-paper">
          <div className="absolute inset-0 blueprint-grid opacity-70" />
          <div className="absolute inset-0 grain" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
            <Reveal>
              <div className="dim-line dim-line--tick dim-line--amber max-w-sm">
                <span>portfolio · as-built</span>
              </div>
              <h1 className="mt-5 hero-headline text-5xl sm:text-7xl md:text-8xl max-w-3xl">
                Work we'll put <br /><span className="text-amber">our name on.</span>
              </h1>
              <p className="mt-6 max-w-xl text-paper/70 text-lg">
                Every photo below is a real job, shot after client sign-off. Filter by room.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- tabs ---------- */}
        <section className="bg-paper border-b border-line sticky top-16 z-30">
          <nav
            className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-2"
            aria-label="Portfolio categories"
          >
            {PORTFOLIO_CATEGORIES.map((c) => (
              <Link
                key={c.key}
                href={`/portfolio?tab=${c.key}`}
                aria-current={active === c.key ? "page" : undefined}
                className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                  active === c.key
                    ? "bg-ink text-paper border-ink"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </nav>
        </section>

        {/* ---------- grid ---------- */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 min-h-[50vh]">
          {items.length === 0 ? (
            <p className="text-center text-ink-soft py-16">
              No projects in this category yet — check back soon.
            </p>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-10">
                <p className="font-display font-black text-2xl">{activeLabel}</p>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
                  {items.length} projects
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <Reveal key={p.id} delay={((i % 3) + 1)}>
                    <figure className="group card overflow-hidden zoom-img tilt h-full">
                      <div className="relative overflow-hidden">
                        <Img
                          src={p.image_url}
                          alt={p.title}
                          className="w-full h-72 object-cover"
                        />
                        <span className="absolute top-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] bg-ink/85 text-amber px-2 py-1">
                          #{String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <figcaption className="p-5">
                        <span className="font-display font-bold">{p.title}</span>
                        {p.description && (
                          <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{p.description}</p>
                        )}
                      </figcaption>
                    </figure>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </section>

        <CTABand
          poster="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
          eyebrow="your project next"
          title={<>Yours could be <span className="text-amber">on this page</span> next quarter.</>}
          subtitle="Book a visit and we'll add your finished job to the portfolio — with your permission, of course."
          primaryLabel="Start your project"
          secondaryHref="/#services"
          secondaryLabel="See services"
        />
      </main>
      <SiteFooter />
    </>
  );
}
