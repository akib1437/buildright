import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function AuthShell({ eyebrow, title, children, footer }) {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="blueprint-grid text-paper hidden lg:flex flex-col justify-between p-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span aria-hidden className="grid place-items-center w-8 h-8 bg-amber text-ink font-display font-black text-lg">B</span>
          <span className="font-display font-extrabold tracking-tight text-lg">{SITE.name}</span>
        </Link>
        <div>
          <div className="dim-line dim-line--tick dim-line--amber max-w-xs mb-5">
            <span>accounts · site access</span>
          </div>
          <p className="font-display font-extrabold text-4xl leading-tight max-w-sm">
            One login for booking, tracking and sign-off.
          </p>
        </div>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-paper/40">
          {SITE.tagline}
        </p>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden font-display font-extrabold text-lg">← {SITE.name}</Link>
          <p className="mt-6 lg:mt-0 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">{eyebrow}</p>
          <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">{title}</h1>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-ink-soft">{footer}</div>
        </div>
      </div>
    </main>
  );
}
