import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import StatusBadge from "@/components/StatusBadge";
import CancelBookingButton from "@/components/CancelBookingButton";
import { createClient } from "@/lib/supabase/server";
import { bookingModel } from "@/models/bookingModel";
import { profileModel } from "@/models/profileModel";
import { formatDate, SITE } from "@/lib/constants";

export const revalidate = 0;
export const metadata = { title: `My requests — ${SITE.name}` };

const SERVICE_LABEL = {
  repair: "Repairs & Handyman",
  remodel: "Remodeling & Interior Work",
  addition: "Exterior & Property Work",
};

export default async function DashboardPage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const [profile, bookings] = await Promise.all([
    profileModel.get(supabase, user.id),
    bookingModel.listForUser(supabase, user.id),
  ]);
  if (profile?.role === "admin") redirect("/admin");

  const upcoming = bookings.filter((booking) =>
    ["pending", "confirmed"].includes(booking.status)
  );
  const past = bookings.filter(
    (booking) => !["pending", "confirmed"].includes(booking.status)
  );

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14 min-h-[70vh]">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">
          customer dashboard
        </p>
        <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
          {profile?.full_name ? `Hi, ${profile.full_name.split(" ")[0]}` : "My requests"}
        </h1>

        {searchParams?.booked && (
          <p className="mt-5 border border-emerald-700/40 bg-emerald-600/10 text-emerald-800 text-sm px-4 py-3">
            Estimate request sent. K2 Contractors LLC will review it and confirm the next steps.
          </p>
        )}

        <section className="mt-10">
          <h2 className="dim-line dim-line--tick max-w-xs">
            <span>active requests · {upcoming.length}</span>
          </h2>

          {upcoming.length === 0 ? (
            <div className="card mt-4 p-8 text-center">
              <p className="text-ink-soft">No active estimate requests.</p>
              <Link href="/#services" className="btn-amber mt-4">Request an estimate</Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {upcoming.map((booking) => (
                <article
                  key={booking.id}
                  className="card p-5 flex flex-wrap items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-display font-bold">
                        {SERVICE_LABEL[booking.service_slug] || booking.service_slug}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="mt-1.5 font-mono text-sm text-blueprint">
                      {formatDate(booking.booking_date)} · {booking.time_slot}
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {[booking.option_1, booking.option_2, booking.property_type]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {booking.admin_note && (
                      <p className="mt-2 text-sm border-l-2 border-amber pl-3 text-ink-soft">
                        Note from K2: {booking.admin_note}
                      </p>
                    )}
                  </div>
                  <CancelBookingButton id={booking.id} />
                </article>
              ))}
            </div>
          )}
        </section>

        {past.length > 0 && (
          <section className="mt-12">
            <h2 className="dim-line dim-line--tick max-w-xs">
              <span>history · {past.length}</span>
            </h2>
            <div className="mt-4 space-y-2">
              {past.map((booking) => (
                <article
                  key={booking.id}
                  className="card p-4 flex flex-wrap items-center justify-between gap-3 text-sm"
                >
                  <span className="font-display font-bold">
                    {SERVICE_LABEL[booking.service_slug] || booking.service_slug}
                  </span>
                  <span className="font-mono text-ink-soft">
                    {formatDate(booking.booking_date)} · {booking.time_slot}
                  </span>
                  <StatusBadge status={booking.status} />
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
