import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="dim-line dim-line--tick dim-line--light max-w-md mb-12">
          <span>site plan · {SITE.shortName.toLowerCase()}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:gap-12 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div className="col-span-2 md:col-span-1 flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={SITE.logo}
              alt={`${SITE.name} logo`}
              className="w-32 h-32 md:w-44 md:h-44 object-contain shrink-0"
            />
            <div>
              <p className="font-display font-black text-3xl tracking-tight">{SITE.name}</p>
              <p className="mt-3 text-paper/60 text-sm max-w-xs leading-relaxed">
                {SITE.tagline}. Free estimates for residential and commercial projects.
                No job too big or small.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/#services" className="btn-amber !py-2 !px-4 text-xs">
                  Request estimate
                </Link>
                <a href={SITE.phoneHref} className="btn-ghost-light !py-2 !px-4 text-xs">
                  Call now
                </a>
              </div>
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber mb-3">
              Company
            </p>
            <ul className="space-y-2 text-paper/70 text-sm">
              <li><Link href="/portfolio" className="hover:text-amber transition-colors">Gallery</Link></li>
              <li><Link href="/#process" className="hover:text-amber transition-colors">Process</Link></li>
              <li><Link href="/#service-area" className="hover:text-amber transition-colors">Service area</Link></li>
              <li><Link href="/#contact" className="hover:text-amber transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber mb-3">
              Requests
            </p>
            <ul className="space-y-2 text-paper/70 text-sm">
              <li><Link href="/schedule/repair" className="hover:text-amber transition-colors">Repairs & Handyman</Link></li>
              <li><Link href="/schedule/remodel" className="hover:text-amber transition-colors">Remodeling</Link></li>
              <li><Link href="/schedule/addition" className="hover:text-amber transition-colors">Exterior & Property</Link></li>
              <li><Link href="/signup" className="hover:text-amber transition-colors">Create account</Link></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber mb-3">
              Reach us
            </p>
            <ul className="space-y-2 text-paper/70 text-sm">
              <li><a href={SITE.phoneHref} className="hover:text-amber transition-colors">{SITE.phone}</a></li>
              <li><a href={SITE.emailHref} className="hover:text-amber transition-colors lowercase">{SITE.email}</a></li>
              <li>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber transition-colors"
                >
                  @{SITE.instagram}
                </a>
              </li>
              <li className="text-paper/50 leading-relaxed">{SITE.address}</li>
              <li className="text-paper/50 leading-relaxed">{SITE.companyType}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-wrap items-center justify-between gap-3 text-paper/40 font-mono text-[0.65rem] uppercase tracking-[0.18em]">
          <span>© {new Date().getFullYear()} {SITE.name} · {SITE.tagline}</span>
          <Link href="/signup/admin" className="hover:text-amber transition-colors">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
