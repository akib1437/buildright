import Link from "next/link";
import { SITE } from "@/lib/constants";
import { HOURS } from "@/lib/locale";

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="dim-line dim-line--tick dim-line--light max-w-md mb-12">
          <span>site plan · {SITE.name.toLowerCase()}</span>
        </div>

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display font-black text-3xl tracking-tight">{SITE.name}</p>
            <p className="mt-3 text-paper/60 text-sm max-w-xs leading-relaxed">
              Licensed, bonded and insured. Repairs, remodels and additions built to code
              and built to last.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/#services" className="btn-amber !py-2 !px-4 text-xs">Book a visit</Link>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost-light !py-2 !px-4 text-xs">
                Call now
              </a>
            </div>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber mb-3">Company</p>
            <ul className="space-y-2 text-paper/70 text-sm">
              <li><Link href="/portfolio" className="hover:text-amber transition-colors">Portfolio</Link></li>
              <li><Link href="/#process" className="hover:text-amber transition-colors">Process</Link></li>
              <li><Link href="/#reviews" className="hover:text-amber transition-colors">Reviews</Link></li>
              <li><Link href="/#contact" className="hover:text-amber transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber mb-3">Services</p>
            <ul className="space-y-2 text-paper/70 text-sm">
              <li><Link href="/schedule/repair" className="hover:text-amber transition-colors">Repair</Link></li>
              <li><Link href="/schedule/remodel" className="hover:text-amber transition-colors">Remodel</Link></li>
              <li><Link href="/schedule/addition" className="hover:text-amber transition-colors">Addition</Link></li>
              <li><Link href="/signup" className="hover:text-amber transition-colors">Create account</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber mb-3">Reach us</p>
            <ul className="space-y-2 text-paper/70 text-sm">
              <li><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-amber transition-colors">{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`} className="hover:text-amber transition-colors lowercase">{SITE.email}</a></li>
              <li className="text-paper/50 leading-relaxed">{SITE.address}</li>
              <li className="pt-3 mt-3 border-t border-paper/10 text-paper/50 space-y-1">
                {HOURS.map((h) => (
                  <div key={h.label} className="flex justify-between gap-3">
                    <span>{h.label}</span>
                    <span className="text-paper/70 tabular-nums">{h.value}</span>
                  </div>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-paper/10 flex flex-wrap items-center justify-between gap-3 text-paper/40 font-mono text-[0.65rem] uppercase tracking-[0.18em]">
          <span>© {new Date().getFullYear()} {SITE.name} — Licensed, Bonded & Insured</span>
          <Link href="/signup/admin" className="hover:text-amber transition-colors">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
