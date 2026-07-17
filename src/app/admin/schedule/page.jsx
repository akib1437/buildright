import ScheduleManager from "@/components/admin/ScheduleManager";
import { createClient } from "@/lib/supabase/server";
import { bookingModel } from "@/models/bookingModel";

export const revalidate = 0;

export default async function AdminSchedulePage({ searchParams }) {
  const supabase = createClient();
  const bookings = await bookingModel.listAll(supabase);
  return (
    <main>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">admin · schedule manager</p>
      <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">All bookings</h1>
      <p className="mt-2 text-sm text-ink-soft max-w-2xl">
        Confirm or decline new requests, mark visits completed, leave notes customers can see,
        and filter by status, service or date.
      </p>
      <div className="mt-8">
        <ScheduleManager bookings={bookings} initialStatus={searchParams?.status} />
      </div>
    </main>
  );
}
