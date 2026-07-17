import ServicesManager from "@/components/admin/ServicesManager";
import { createClient } from "@/lib/supabase/server";
import { serviceModel } from "@/models/serviceModel";

export const revalidate = 0;

export default async function AdminServicesPage() {
  const supabase = createClient();
  const services = await serviceModel.listAll(supabase);
  return (
    <main>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">admin · services</p>
      <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">Service catalog</h1>
      <p className="mt-2 text-sm text-ink-soft max-w-2xl">
        Edit the copy, price ranges and durations shown on the site. Toggling a service
        inactive hides it and blocks new bookings for it.
      </p>
      <div className="mt-8 space-y-6">
        <ServicesManager services={services} />
      </div>
    </main>
  );
}
