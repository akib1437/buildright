import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer className="blueprint-grid text-paper mt-0">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="dim-line dim-line--tick dim-line--light mb-10">
          <span>site plan · {SITE.name.toLowerCase()}</span>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display font-extrabold text-2xl tracking-tight">{SITE.name}</p>
            <p className="mt-2 text-paper/60 text-sm max-w-xs">
              Licensed & insured. Repairs, remodels and additions built to code and built to last.
            </p>
          </div>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.16em] space-y-2 text-paper/70">
            <p className="text-amber">Visit hours</p>
            <p>Mon – Sat · 09:00 – 17:00</p>
            <p>Sunday · closed</p>
          </div>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.16em] space-y-2 text-paper/70">
            <p className="text-amber">Contact</p>
            <p>{SITE.phone}</p>
            <p className="lowercase">{SITE.email}</p>
            <p className="normal-case tracking-normal">{SITE.address}</p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-paper/15 flex flex-wrap items-center justify-between gap-3 text-paper/40 font-mono text-[0.65rem] uppercase tracking-[0.18em]">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span className="flex gap-5">
            <Link href="/portfolio" className="hover:text-paper">Portfolio</Link>
            <Link href="/signup" className="hover:text-paper">Create account</Link>
            <Link href="/signup/admin" className="hover:text-paper">Staff</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
