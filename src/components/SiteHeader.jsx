import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { profileModel } from "@/models/profileModel";
import { signOut } from "@/controllers/authController";
import { SITE } from "@/lib/constants";

export default async function SiteHeader() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const profile = user ? await profileModel.get(supabase, user.id) : null;

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span aria-hidden className="grid place-items-center w-8 h-8 bg-ink text-amber font-display font-black text-lg leading-none">
            B
          </span>
          <span className="font-display font-extrabold tracking-tight text-lg">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-soft">
          <Link href="/#services" className="hover:text-ink">Services</Link>
          <Link href="/portfolio" className="hover:text-ink">Portfolio</Link>
          <Link href="/#process" className="hover:text-ink">Process</Link>
          <Link href="/#contact" className="hover:text-ink">Contact</Link>
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link
                href={profile?.role === "admin" ? "/admin" : "/dashboard"}
                className="btn-ghost !py-2 !px-3.5 text-xs"
              >
                {profile?.role === "admin" ? "Admin panel" : "My bookings"}
              </Link>
              <form action={signOut}>
                <button className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft hover:text-ink">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-soft hover:text-ink">
                Log in
              </Link>
              <Link href="/#services" className="btn-amber !py-2 !px-3.5 text-xs">
                Book a visit
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
