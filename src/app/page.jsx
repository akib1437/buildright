import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";
import AutoScroller from "@/components/AutoScroller";
import FAQ from "@/components/FAQ";
import AreasServed from "@/components/AreasServed";
import CTABand from "@/components/CTABand";
import ContactForm from "@/components/ContactForm";
import Img from "@/components/Img";
import { createClient } from "@/lib/supabase/server";
import { serviceModel } from "@/models/serviceModel";
import { portfolioModel } from "@/models/portfolioModel";
import {
  ALL_SERVICES,
  PORTFOLIO_CATEGORIES,
  SERVICE_CATEGORIES,
  SITE,
} from "@/lib/constants";
import { LOCALE } from "@/lib/locale";

export const revalidate = 0;

// Representative construction imagery. Replace with verified K2 project photos when available.
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=2000&q=80",
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=2000&q=80",
];

const CTA_POSTER =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80";
const CTA_CLOSING_POSTER =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80";

const HIGHLIGHTS = [
  { value: "Free", label: "estimates" },
  { value: "Residential", label: "projects" },
  { value: "Commercial", label: "projects" },
  { value: "Any size", label: "no job too big or small" },
];

const PROCESS = [
  {
    step: "01",
    title: "Send a request",
    text: "Choose a service and request a time online, or contact K2 by phone, email, or Instagram.",
  },
  {
    step: "02",
    title: "Discuss the work",
    text: "Share the job location, project details, photos, and the timing you prefer.",
  },
  {
    step: "03",
    title: "Get a free estimate",
    text: "K2 reviews the scope and provides an estimate before the work is scheduled.",
  },
  {
    step: "04",
    title: "Confirm next steps",
    text: "Agree on the scope and scheduling details, then track the request from your account.",
  },
];

export default async function HomePage() {
  const supabase = createClient();
  const [services, allPortfolio] = await Promise.all([
    serviceModel.listActive(supabase),
    portfolioModel.listAll(supabase),
  ]);

  const preview = PORTFOLIO_CATEGORIES.map((category) => ({
    ...category,
    count: allPortfolio.filter((item) => item.category === category.key).length,
  }));
  const hasGallery = allPortfolio.length > 0;

  return (
    <>
      <SiteHeader transparent />
      <main>
        <HeroSlideshow images={HERO_IMAGES}>
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-32 sm:pt-40 pb-24 min-h-[92vh] flex flex-col justify-end">
            <div className="max-w-3xl">
              <div className="dim-line dim-line--tick dim-line--amber max-w-sm mb-8">
                <span>{LOCALE.region} · {SITE.companyType}</span>
              </div>
              <h1 className="hero-headline text-5xl sm:text-7xl md:text-8xl">
                We
                <br />
                <span className="text-amber">Make It</span>
                <br />
                <span className="stroke">Happen.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-paper/75 text-lg leading-relaxed">
                Electrical, plumbing, remodeling, carpentry, flooring, painting,
                landscaping, AC/HVAC, alarms/CCTV, furniture assembly, and handyman
                services. No job too big or small.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/#services" className="btn-amber pulse">Request a free estimate</Link>
                <a href={SITE.phoneHref} className="btn-ghost-light">Call {SITE.phone}</a>
              </div>
            </div>

            <div className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
              <div className="bg-ink/10 backdrop-blur-sm p-4 rounded-sm">
                <img
                  src={SITE.qr}
                  alt={`Scan to contact ${SITE.name}`}
                  className="w-80 h-80 object-contain"
                />
              </div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/70">
                scan · save our contact
              </span>
            </div>

            <div className="absolute right-6 bottom-8 hidden md:flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/60">
              <span className="bob">↓</span>
              <span>scroll · explore services</span>
            </div>
          </div>
        </HeroSlideshow>

        <section className="bg-ink text-paper border-y border-paper/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display font-black text-2xl sm:text-3xl text-amber">
                  {item.value}
                </p>
                <p className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-paper/60">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <Reveal>
            <div className="dim-line dim-line--tick max-w-sm mx-auto">
              <span>services · request an estimate</span>
            </div>
            <h2 className="mt-5 text-center font-display font-black tracking-tight text-4xl sm:text-5xl">
              One contractor. Many ways to help.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {services.map((service, index) => {
              const copy = SERVICE_CATEGORIES[service.slug] || {
                name: service.name,
                tagline: service.tagline,
                description: service.description,
              };
              const heroImage = allPortfolio.find(
                (item) =>
                  (service.slug === "repair" && item.category === "repairs") ||
                  (service.slug === "remodel" && item.category === "kitchen") ||
                  (service.slug === "addition" && item.category === "bath")
              );

              return (
                <Reveal key={service.slug} delay={index + 1}>
                  <article className="group card tilt flex flex-col overflow-hidden h-full">
                    <div className="zoom-img relative h-56 bg-ink/5">
                      {heroImage && (
                        <Img
                          src={heroImage.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                      <span className="absolute top-4 left-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-amber bg-ink/80 px-2.5 py-1">
                        0{index + 1} · {service.slug}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-blueprint">
                        {copy.tagline}
                      </p>
                      <h3 className="mt-2 font-display font-black text-2xl">{copy.name}</h3>
                      <p className="mt-3 text-sm text-ink-soft leading-relaxed flex-1">
                        {copy.description}
                      </p>
                      <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft border-t border-line pt-4">
                        <div>
                          <dt className="text-ink-soft/60">Estimate</dt>
                          <dd className="text-ink mt-0.5">Free</dd>
                        </div>
                        <div>
                          <dt className="text-ink-soft/60">Project type</dt>
                          <dd className="text-ink mt-0.5">Residential & Commercial</dd>
                        </div>
                      </dl>
                      <Link href={`/schedule/${service.slug}`} className="btn-amber mt-6 w-full">
                        Request estimate
                      </Link>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-20">
              <div className="dim-line dim-line--tick max-w-sm mx-auto">
                <span>everything we handle · residential &amp; commercial</span>
              </div>
              <p className="mt-5 text-center text-ink-soft text-sm max-w-md mx-auto">
                No job too big or small. Free estimates are available.
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

        {hasGallery && (
          <section className="bg-ink text-paper py-20 overflow-hidden">
            <Reveal>
              <div className="mx-auto max-w-6xl px-4 sm:px-6 mb-10">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="dim-line dim-line--tick dim-line--amber max-w-[260px]">
                      <span>service gallery · representative images</span>
                    </div>
                    <h2 className="mt-4 font-display font-black tracking-tight text-4xl sm:text-5xl">
                      See the kinds of work we handle
                    </h2>
                    <p className="mt-4 text-paper/60 max-w-2xl">
                      Gallery images are representative unless a verified K2 project photo is
                      uploaded through the admin panel.
                    </p>
                  </div>
                  <Link href="/portfolio" className="btn-ghost-light">Browse the gallery →</Link>
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
                    {count} images →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section id="process" className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <Reveal>
            <div className="dim-line dim-line--tick max-w-sm mx-auto">
              <span>how to get started</span>
            </div>
            <h2 className="mt-5 text-center font-display font-black tracking-tight text-4xl sm:text-5xl">
              From request to scheduled work
            </h2>
            <p className="mt-4 text-center text-ink-soft max-w-xl mx-auto">
              Send the details, receive a free estimate, and confirm the next steps with K2.
            </p>
          </Reveal>

          <ol className="mt-16 grid gap-6 md:grid-cols-4">
            {PROCESS.map((item, index) => (
              <Reveal key={item.step} delay={index + 1}>
                <li className="card p-6 h-full relative">
                  <span className="font-display font-black text-5xl text-amber/20 leading-none absolute top-4 right-4">
                    {item.step}
                  </span>
                  <span className="font-mono text-blueprint text-sm">{item.step}</span>
                  <h3 className="mt-2 font-display font-bold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{item.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <CTABand
          poster={CTA_POSTER}
          eyebrow="free estimates"
          title={<>Tell us what you need. <span className="text-amber">K2 will follow up.</span></>}
          subtitle="Call, email, message on Instagram, or send a booking request with the job details."
          primaryLabel="Request an estimate"
        />

        <FAQ />
        <AreasServed />

        <section id="contact" className="bg-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24 grid gap-12 md:grid-cols-2">
            <Reveal>
              <div>
                <div className="dim-line dim-line--tick max-w-[240px]">
                  <span>contact K2</span>
                </div>
                <h2 className="mt-5 font-display font-black tracking-tight text-4xl sm:text-5xl">
                  Ask a question or request an estimate
                </h2>
                <p className="mt-4 text-ink-soft max-w-md">
                  Send the project details and K2 Contractors LLC will follow up to discuss
                  the scope, location, and scheduling.
                </p>
                <div className="mt-8 space-y-3 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-ink-soft">
                  <p className="flex items-center gap-3">
                    <span className="text-amber">▲</span>
                    <a href={SITE.phoneHref} className="hover:text-ink">{SITE.phone}</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-amber">▲</span>
                    <a href={SITE.emailHref} className="hover:text-ink lowercase">{SITE.email}</a>
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="text-amber">▲</span>
                    <a
                      href={SITE.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-ink"
                    >
                      @{SITE.instagram}
                    </a>
                  </p>
                  <p className="flex items-start gap-3 normal-case tracking-normal">
                    <span className="text-amber mt-1">▲</span>
                    <span>{SITE.address} · {SITE.companyType}</span>
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay="2">
              <ContactForm />
            </Reveal>
          </div>
        </section>

        <CTABand
          poster={CTA_CLOSING_POSTER}
          eyebrow="we make it happen"
          title={<>Your project starts with a <span className="text-amber">free estimate.</span></>}
          subtitle="Residential or commercial, large project or small repair—send K2 the details."
          primaryLabel="Start a request"
        />
      </main>
      <SiteFooter />
    </>
  );
}
