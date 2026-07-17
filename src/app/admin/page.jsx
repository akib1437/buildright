import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { bookingModel } from "@/models/bookingModel";
import { messageModel } from "@/models/messageModel";
import { portfolioModel } from "@/models/portfolioModel";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/lib/constants";

export const revalidate = 0;

export default async function AdminOverview() {
  const supabase = createClient();
  const [counts, allBookings, messages, portfolio] = await Promise.all([
    bookingModel.counts(supabase),
    bookingModel.listAll(supabase),
    messageModel.listAll(supabase),
    portfolioModel.listAll(supabase),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = allBookings
    .filter((b) => b.booking_date >= today && ["pending", "confirmed"].includes(b.status))
    .slice(0, 6);
  const unread = messages.filter((m) => !m.read).length;

  const stats = [
    { label: "Pending requests", value: counts.pending, href: "/admin/schedule?status=pending" },
    { label: "Confirmed jobs", value: counts.confirmed, href: "/admin/schedule?status=confirmed" },
    { label: "Completed", value: counts.completed, href: "/admin/schedule?status=completed" },
    { label: "Unread messages", value: unread, href: "/admin/messages" },
    { label: "Portfolio items", value: portfolio.length, href: "/admin/portfolio" },
  ];

  return (
    <main>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">admin · overview</p>
      <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">Job board</h1>

      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-5 hover:border-ink transition-colors">
            <p className="font-display font-black text-3xl">{s.value}</p>
            <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-soft">{s.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="dim-line dim-line--tick max-w-xs"><span>next visits</span></h2>
          <Link href="/admin/schedule" className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-blueprint hover:underline">
            Open schedule manager →
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-ink-soft text-sm">No upcoming bookings.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {upcoming.map((b) => (
              <div key={b.id} className="card p-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="font-mono text-blueprint">{formatDate(b.booking_date)} · {b.time_slot}</span>
                <span className="font-display font-bold capitalize">{b.service_slug}</span>
                <span className="text-ink-soft">{b.profiles?.full_name}</span>
                <span className="ml-auto"><StatusBadge status={b.status} /></span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
