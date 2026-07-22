import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import CTABand from "@/components/CTABand";
import Img from "@/components/Img";
import { createClient } from "@/lib/supabase/server";
import { portfolioModel } from "@/models/portfolioModel";
import { PORTFOLIO_CATEGORIES, SITE } from "@/lib/constants";

export const revalidate = 0;
export const metadata = { title: `Service gallery — ${SITE.name}` };

export default async function PortfolioPage({ searchParams }) {
  const active = PORTFOLIO_CATEGORIES.some((category) => category.key === searchParams?.tab)
    ? searchParams.tab
    : "kitchen";
  const supabase = createClient();
  const items = await portfolioModel.listByCategory(supabase, active);
  const activeLabel = PORTFOLIO_CATEGORIES.find((category) => category.key === active)?.label;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-paper">
          <div className="absolute inset-0 blueprint-grid opacity-70" />
          <div className="absolute inset-0 grain" />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-32">
            <Reveal>
              <div className="dim-line dim-line--tick dim-line--amber max-w-sm">
                <span>service gallery</span>
              </div>
              <h1 className="mt-5 hero-headline text-5xl sm:text-7xl md:text-8xl max-w-3xl">
                See the work types <br /><span className="text-amber">K2 can handle.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-paper/70 text-lg">
                Images are representative examples unless a verified K2 project photo has
                been uploaded through the admin panel.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-paper border-b border-line sticky top-16 z-30">
          <nav
            className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-2"
            aria-label="Gallery categories"
          >
            {PORTFOLIO_CATEGORIES.map((category) => (
              <Link
                key={category.key}
                href={`/portfolio?tab=${category.key}`}
                aria-current={active === category.key ? "page" : undefined}
                className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                  active === category.key
                    ? "bg-ink text-paper border-ink"
                    : "border-line text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 min-h-[50vh]">
          {items.length === 0 ? (
            <p className="text-center text-ink-soft py-16">
              No gallery images in this category yet.
            </p>
          ) : (
            <>
              <div className="flex items-baseline justify-between mb-10">
                <p className="font-display font-black text-2xl">{activeLabel}</p>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
                  {items.length} images
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <Reveal key={item.id} delay={((index % 3) + 1)}>
                    <figure className="group card overflow-hidden zoom-img tilt h-full">
                      <div className="relative overflow-hidden">
                        <Img
                          src={item.image_url}
                          alt={`${activeLabel} service example`}
                          className="w-full h-72 object-cover"
                        />
                        <span className="absolute top-3 left-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] bg-ink/85 text-amber px-2 py-1">
                          representative image · #{String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <figcaption className="p-5">
                        <span className="font-display font-bold">{activeLabel} service example</span>
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
          eyebrow="free estimates"
          title={<>Have a project in mind? <span className="text-amber">Tell K2 about it.</span></>}
          subtitle="Send the scope, location, and preferred timing to request an estimate."
          primaryLabel="Request an estimate"
          secondaryHref="/#services"
          secondaryLabel="See services"
        />
      </main>
      <SiteFooter />
    </>
  );
}
