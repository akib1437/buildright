import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
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

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16 min-h-[70vh]">
        <div className="dim-line dim-line--tick max-w-sm mx-auto">
          <span>portfolio · as-built</span>
        </div>
        <h1 className="mt-5 text-center font-display font-extrabold tracking-tight text-4xl sm:text-5xl">
          Work we'll put our name on
        </h1>
        <p className="mt-4 text-center text-ink-soft max-w-xl mx-auto">
          Every photo below is a real job, shot after client sign-off. Filter by room.
        </p>

        {/* tabs */}
        <nav className="mt-10 flex justify-center gap-2 flex-wrap" aria-label="Portfolio categories">
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

        {/* grid */}
        {items.length === 0 ? (
          <p className="mt-16 text-center text-ink-soft">
            No projects in this category yet — check back soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <figure key={p.id} className="card overflow-hidden group">
                <div className="overflow-hidden">
                  <Img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-64 object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                </div>
                <figcaption className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display font-bold">{p.title}</span>
                    <span className="font-mono text-[0.62rem] text-blueprint shrink-0">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  {p.description && (
                    <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{p.description}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/#services" className="btn-amber">Start your project</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
