import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileModel } from "@/models/profileModel";
import { signOut } from "@/controllers/authController";
import { SITE } from "@/lib/constants";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/schedule", label: "Schedule manager" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/messages", label: "Messages" },
];

export const metadata = { title: "Admin — BuildRight" };

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");
  const profile = await profileModel.get(supabase, user.id);
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="blueprint-grid text-paper lg:min-h-screen">
        <div className="p-6 flex lg:flex-col gap-6 lg:gap-0 items-center lg:items-stretch justify-between lg:justify-start lg:h-full">
          <Link href="/" className="flex items-center gap-2.5">
            <span aria-hidden className="grid place-items-center w-8 h-8 bg-amber text-ink font-display font-black text-lg">B</span>
            <span className="font-display font-extrabold tracking-tight">{SITE.name}</span>
          </Link>
          <nav className="lg:mt-10 flex lg:flex-col gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="font-mono text-[0.68rem] uppercase tracking-[0.16em] whitespace-nowrap px-3 py-2.5 text-paper/70 hover:text-amber hover:bg-paper/5"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="lg:mt-auto">
            <p className="hidden lg:block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-paper/40 mb-2">
              {profile.full_name || user.email}
            </p>
            <form action={signOut}>
              <button className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/60 hover:text-paper">
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="p-5 sm:p-8 lg:p-10">{children}</div>
    </div>
  );
}
