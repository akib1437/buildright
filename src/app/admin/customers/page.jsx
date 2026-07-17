import { createClient } from "@/lib/supabase/server";
import { profileModel } from "@/models/profileModel";
import { bookingModel } from "@/models/bookingModel";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const supabase = createClient();
  const [profiles, bookings] = await Promise.all([
    profileModel.listCustomers(supabase),
    bookingModel.listAll(supabase),
  ]);
  const bookingCount = {};
  for (const b of bookings) bookingCount[b.user_id] = (bookingCount[b.user_id] || 0) + 1;

  return (
    <main>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">admin · customers</p>
      <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">Accounts</h1>
      <div className="mt-8 card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-soft text-left">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Bookings</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0">
                <td className="px-4 py-3 font-semibold">{p.full_name || "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{p.phone || "—"}</td>
                <td className="px-4 py-3">
                  <span className={p.role === "admin" ? "badge-confirmed" : "badge-cancelled"}>{p.role}</span>
                </td>
                <td className="px-4 py-3">{bookingCount[p.id] || 0}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
