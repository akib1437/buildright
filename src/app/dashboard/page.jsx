import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StatusBadge from "@/components/StatusBadge";
import CancelBookingButton from "@/components/CancelBookingButton";
import { createClient } from "@/lib/supabase/server";
import { bookingModel } from "@/models/bookingModel";
import { profileModel } from "@/models/profileModel";
import { formatDate } from "@/lib/constants";

export const revalidate = 0;
export const metadata = { title: "My bookings — BuildRight" };

const SERVICE_LABEL = { repair: "Repair", remodel: "Remodel", addition: "Addition" };

export default async function DashboardPage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const [profile, bookings] = await Promise.all([
    profileModel.get(supabase, user.id),
    bookingModel.listForUser(supabase, user.id),
  ]);
  if (profile?.role === "admin") redirect("/admin");

  const upcoming = bookings.filter((b) => ["pending", "confirmed"].includes(b.status));
  const past = bookings.filter((b) => !["pending", "confirmed"].includes(b.status));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14 min-h-[70vh]">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">customer dashboard</p>
        <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
          {profile?.full_name ? `Hi, ${profile.full_name.split(" ")[0]}` : "My bookings"}
        </h1>

        {searchParams?.booked && (
          <p className="mt-5 border border-emerald-700/40 bg-emerald-600/10 text-emerald-800 text-sm px-4 py-3">
            Booking request sent. Our scheduler will confirm it shortly — status updates show here.
          </p>
        )}

        <section className="mt-10">
          <h2 className="dim-line dim-line--tick max-w-xs"><span>upcoming · {upcoming.length}</span></h2>
          {upcoming.length === 0 ? (
            <div className="card mt-4 p-8 text-center">
              <p className="text-ink-soft">No upcoming visits booked.</p>
              <Link href="/#services" className="btn-amber mt-4">Schedule one</Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {upcoming.map((b) => (
                <article key={b.id} className="card p-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-display font-bold">{SERVICE_LABEL[b.service_slug] || b.service_slug}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="mt-1.5 font-mono text-sm text-blueprint">
                      {formatDate(b.booking_date)} · {b.time_slot}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {[b.option_1, b.option_2, b.property_type].filter(Boolean).join(" · ")}
                    </p>
                    {b.admin_note && (
                      <p className="mt-2 text-sm border-l-2 border-amber pl-3 text-ink-soft">
                        Note from us: {b.admin_note}
                      </p>
                    )}
                  </div>
                  <CancelBookingButton id={b.id} />
                </article>
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section className="mt-12">
            <h2 className="dim-line dim-line--tick max-w-xs"><span>history · {past.length}</span></h2>
            <div className="mt-4 space-y-2">
              {past.map((b) => (
                <article key={b.id} className="card p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <span className="font-display font-bold">{SERVICE_LABEL[b.service_slug] || b.service_slug}</span>
                  <span className="font-mono text-ink-soft">{formatDate(b.booking_date)} · {b.time_slot}</span>
                  <StatusBadge status={b.status} />
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
