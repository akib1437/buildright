import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { profileModel } from "@/models/profileModel";
import { signOut } from "@/controllers/authController";
import { SITE } from "@/lib/constants";
import HeaderScroll from "@/components/HeaderScroll";

export default async function SiteHeader({ transparent = false }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await profileModel.get(supabase, user.id) : null;

  return (
    <HeaderScroll transparent={transparent}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span aria-hidden className="grid place-items-center w-8 h-8 bg-amber text-ink font-display font-black text-lg leading-none">
            {SITE.name.charAt(0)}
          </span>
          <span className="font-display font-extrabold tracking-tight text-lg">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] header-links">
          <Link href="/#services" className="underline-sweep">Services</Link>
          <Link href="/portfolio" className="underline-sweep">Portfolio</Link>
          <Link href="/#process" className="underline-sweep">Process</Link>
          <Link href="/#reviews" className="underline-sweep">Reviews</Link>
          <Link href="/#contact" className="underline-sweep">Contact</Link>
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              <Link
                href={profile?.role === "admin" ? "/admin" : "/dashboard"}
                className="header-cta-secondary text-xs font-mono uppercase tracking-[0.14em] border px-3 py-2"
              >
                {profile?.role === "admin" ? "Admin" : "My bookings"}
              </Link>
              <form action={signOut}>
                <button className="font-mono text-[0.68rem] uppercase tracking-[0.16em] header-links">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] header-links">
                Log in
              </Link>
              <Link href="/#services" className="btn-amber !py-2 !px-3.5 text-xs">
                Book a visit
              </Link>
            </>
          )}
        </div>
      </div>
    </HeaderScroll>
  );
}
