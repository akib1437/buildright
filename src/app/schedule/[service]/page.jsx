import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BookingForm from "@/components/BookingForm";
import { createClient } from "@/lib/supabase/server";
import { serviceModel } from "@/models/serviceModel";
import { SERVICE_FORMS } from "@/lib/constants";

export const revalidate = 0;

export default async function SchedulePage({ params }) {
  const formConfig = SERVICE_FORMS[params.service];
  if (!formConfig) notFound();

  const supabase = createClient();
  const service = await serviceModel.getBySlug(supabase, params.service);
  if (!service || !service.active) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14 min-h-[70vh]">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">
          scheduling · {service.slug}
        </p>
        <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl sm:text-4xl">
          {service.name}
        </h1>
        <p className="mt-3 text-ink-soft max-w-2xl">{service.description}</p>
        <div className="mt-4 flex gap-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-soft">
          <span>Typical cost · <b className="text-ink">{service.price_range}</b></span>
          <span>Duration · <b className="text-ink">{service.duration}</b></span>
        </div>
        <hr className="my-8 border-line" />
        <BookingForm service={service} formConfig={formConfig} />
      </main>
      <SiteFooter />
    </>
  );
}
