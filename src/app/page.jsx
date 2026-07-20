import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import AutoScroller from "@/components/AutoScroller";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import AreasServed from "@/components/AreasServed";
import CTABand from "@/components/CTABand";
import ContactForm from "@/components/ContactForm";
import Img from "@/components/Img";
import { createClient } from "@/lib/supabase/server";
import { serviceModel } from "@/models/serviceModel";
import { portfolioModel } from "@/models/portfolioModel";
import { PORTFOLIO_CATEGORIES, SITE, ALL_SERVICES } from "@/lib/constants";
import { LOCALE } from "@/lib/locale";

export const revalidate = 0;

// Hero image slideshow — 4 construction scenes that cross-fade with Ken Burns.
// Swap these URLs for your own photos anytime (any https image works).
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80", // blueprints
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80", // modern kitchen
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80", // planning on site
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=2000&q=80", // finished spa bath
];

const CTA_POSTER =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80";
const CTA_CLOSING_POSTER =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80";

const PROCESS = [
  { step: "01", title: "Book online", text: "Pick a service, a date and a time slot. Under a minute, no phone calls." },
  { step: "02", title: "Site visit", text: "A licensed tech or estimator arrives in your slot and scopes the work." },
  { step: "03", title: "Fixed quote", text: "You get a written, fixed-price quote — no mid-job surprises." },
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
      <SiteHeader transparent />
      <main>
        {/* ============================================================
             HERO — cross-fading photo slideshow with Ken Burns
             ============================================================ */}
        <HeroSlideshow images={HERO_IMAGES}>
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-40 pb-24 min-h-[92vh] flex flex-col justify-end">
            <div className="max-w-3xl">
              <div className="dim-line dim-line--tick dim-line--amber max-w-xs mb-8">
                <span>est. 2011 · {LOCALE.region}</span>
              </div>
              <h1 className="hero-headline text-5xl sm:text-7xl md:text-8xl">
                We build
                <br />
                <span className="text-amber">what you'd</span>
                <br />
                <span className="stroke">brag about.</span>
              </h1>
              <p className="mt-8 max-w-xl text-paper/75 text-lg leading-relaxed">
                Repairs finished in an afternoon. Kitchens and baths rebuilt to the millimetre.
                Additions drawn, permitted and raised — one crew, one contract, one honest price.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/#services" className="btn-amber pulse">Book a visit</Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost-light">Call {SITE.phone}</a>
              </div>
            </div>
            {/* QR code — right side of hero, desktop only */}
            <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
              <div className="bg-ink/10 backdrop-blur-sm p-4 rounded-sm">
                <img
                  src={SITE.qr}
                  alt="Scan to contact K2 Contractors"
                  className="w-80 h-80 object-contain"
                />
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/70">
                scan · save our contact
              </span>
            </div>

            <div className="absolute right-6 bottom-8 hidden md:flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/60">
              <span className="bob">↓</span>
              <span>scroll · see recent work</span>
            </div>
          </div>
        </HeroSlideshow>

        {/* ============================================================
             STATS BAR
             ============================================================ */}
        <section className="bg-ink text-paper border-y border-paper/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <StatCounter to={1400} suffix="+" label="jobs closed" />
            <StatCounter to={15} suffix=" yr" label="in business" />
            <StatCounter to={98} suffix="%" label="on-time rate" />
            <StatCounter to={10} suffix=" yr" label="workmanship warranty" />
          </div>
        </section>

        {/* ============================================================
             SERVICES
             ============================================================ */}
        <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <Reveal>
            <div className="dim-line dim-line--tick max-w-sm mx-auto">
              <span>services · pick one to schedule</span>
            </div>
            <h2 className="mt-5 text-center font-display font-black tracking-tight text-4xl sm:text-5xl">
              Three ways we work on your home
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => {
              const heroImage = allPortfolio.find(
                (p) =>
                  (s.slug === "repair" && p.category === "repairs") ||
                  (s.slug === "remodel" && p.category === "kitchen") ||
                  (s.slug === "addition" && p.category === "bath")
              );
              return (
                <Reveal key={s.slug} delay={i + 1}>
                  <article className="group card tilt flex flex-col overflow-hidden h-full">
                    <div className="zoom-img relative h-56">
                      {heroImage && (
                        <Img
                          src={heroImage.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                      <span className="absolute top-4 left-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-amber bg-ink/80 px-2.5 py-1">
                        0{i + 1} · {s.slug}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-blueprint">{s.tagline}</p>
                      <h3 className="mt-2 font-display font-black text-2xl">{s.name}</h3>
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
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* Full list of everything K2 handles — no job too big or small */}
          <Reveal>
            <div className="mt-20">
              <div className="dim-line dim-line--tick max-w-sm mx-auto">
                <span>everything we handle · residential &amp; commercial</span>
              </div>
              <p className="mt-5 text-center text-ink-soft text-sm max-w-md mx-auto">
                No job too big or small. Free estimates on every service below.
              </p>
              <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
                {ALL_SERVICES.map((service) => (
                  <li
                    key={service}
                    className="font-mono text-[0.68rem] uppercase tracking-[0.14em] border border-line px-3.5 py-2 text-ink-soft hover:border-amber hover:text-ink transition-colors"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* ============================================================
             AUTO-SCROLLING PORTFOLIO STRIP
             ============================================================ */}
        <section className="bg-ink text-paper py-20 overflow-hidden">
          <Reveal>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="dim-line dim-line--tick dim-line--amber max-w-[240px]">
                    <span>finished work · rolling</span>
                  </div>
                  <h2 className="mt-4 font-display font-black tracking-tight text-4xl sm:text-5xl">
                    Proof, by the room
                  </h2>
                </div>
                <Link href="/portfolio" className="btn-ghost-light">Browse the full portfolio →</Link>
              </div>
            </div>
          </Reveal>

          <AutoScroller items={allPortfolio.slice(0, 12)} />
          <AutoScroller items={[...allPortfolio].slice(6, 18).reverse()} slow />

          <div className="mx-auto max-w-6xl px-4 sm:px-6 mt-10 grid gap-3 sm:grid-cols-3">
            {preview.map(({ key, label, count }) => (
              <Link
                key={key}
                href={`/portfolio?tab=${key}`}
                className="group flex items-center justify-between border border-paper/15 px-5 py-4 hover:border-amber hover:bg-amber/5 transition-colors"
              >
                <span className="font-display font-bold">{label}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-paper/60 group-hover:text-amber">
                  {count} projects →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ============================================================
             PROCESS
             ============================================================ */}
        <section id="process" className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <Reveal>
            <div className="dim-line dim-line--tick max-w-sm mx-auto">
              <span>how a job runs</span>
            </div>
            <h2 className="mt-5 text-center font-display font-black tracking-tight text-4xl sm:text-5xl">
              From booking to sign-off
            </h2>
            <p className="mt-4 text-center text-ink-soft max-w-xl mx-auto">
              Four steps. No sales calls in the middle. No "let me check with the office" delays.
            </p>
          </Reveal>

          <ol className="mt-16 grid gap-6 md:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i + 1}>
                <li className="card p-6 h-full relative">
                  <span className="font-display font-black text-5xl text-amber/20 leading-none absolute top-4 right-4">
                    {p.step}
                  </span>
                  <span className="font-mono text-blueprint text-sm">{p.step}</span>
                  <h3 className="mt-2 font-display font-bold text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{p.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* ============================================================
             MID-PAGE CTA
             ============================================================ */}
        <CTABand
          poster={CTA_POSTER}
          eyebrow="two slots left this week"
          title={<>Book the visit. <span className="text-amber">Skip the guesswork.</span></>}
          subtitle="A written, fixed-price quote inside three business days — or your booking fee comes back."
          primaryLabel="Book my visit"
        />

        {/* ============================================================
             TESTIMONIALS
             ============================================================ */}
        <Testimonials />

        {/* ============================================================
             FAQ
             ============================================================ */}
        <FAQ />

        {/* ============================================================
             AREAS SERVED
             ============================================================ */}
        <AreasServed />

        {/* ============================================================
             CONTACT
             ============================================================ */}
        <section id="contact" className="bg-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 grid gap-12 md:grid-cols-2">
            <Reveal>
              <div>
                <div className="dim-line dim-line--tick max-w-[240px]">
                  <span>questions first?</span>
                </div>
                <h2 className="mt-5 font-display font-black tracking-tight text-4xl sm:text-5xl">
                  Talk to us before you book
                </h2>
                <p className="mt-4 text-ink-soft max-w-md">
                  Not sure whether it's a repair or a remodel? Send a note — an estimator
                  (not a sales script) replies within one business day.
                </p>
                <div className="mt-8 space-y-3 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-ink-soft">
                  <p className="flex items-center gap-3">
                    <span className="text-amber">▲</span>
                    <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-ink">{SITE.phone}</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-amber">▲</span>
                    <a href={`mailto:${SITE.email}`} className="hover:text-ink lowercase">{SITE.email}</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-amber">▲</span>
                    <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                      @{SITE.instagram}
                    </a>
                  </p>
                  <p className="flex items-start gap-3 normal-case tracking-normal">
                    <span className="text-amber mt-1">▲</span>
                    <span>{SITE.address}</span>
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay="2">
              <ContactForm />
            </Reveal>
          </div>
        </section>

        {/* ============================================================
             CLOSING CTA
             ============================================================ */}
        <CTABand
          poster={CTA_CLOSING_POSTER}
          eyebrow="ready when you are"
          title={<>Your house. <span className="text-amber">Measured twice.</span></>}
          subtitle="Book online, meet the crew, get a fixed quote. That's the whole thing."
          primaryLabel="Start now"
        />
      </main>
      <SiteFooter />
    </>
  );
}