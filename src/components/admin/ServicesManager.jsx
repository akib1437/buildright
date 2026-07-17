"use client";
import { useFormState, useFormStatus } from "react-dom";
import { updateService } from "@/controllers/serviceController";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-amber text-xs !py-2.5" disabled={pending}>
      {pending ? "Saving…" : "Save service"}
    </button>
  );
}

function ServiceForm({ service }) {
  const [state, action] = useFormState(updateService, {});
  return (
    <form action={action} className="card p-5 grid gap-3">
      <input type="hidden" name="id" value={service.id} />
      <div className="flex items-center justify-between gap-3">
        <p className="dim-line dim-line--tick flex-1"><span>{service.slug}</span></p>
        <label className="flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft">
          <input type="checkbox" name="active" defaultChecked={service.active} className="accent-[#2e5e8c] w-4 h-4" />
          Active
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={`name-${service.id}`}>Name</label>
          <input id={`name-${service.id}`} name="name" className="field" defaultValue={service.name} required />
        </div>
        <div>
          <label className="field-label" htmlFor={`tag-${service.id}`}>Tagline</label>
          <input id={`tag-${service.id}`} name="tagline" className="field" defaultValue={service.tagline} />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor={`desc-${service.id}`}>Description</label>
        <textarea id={`desc-${service.id}`} name="description" rows={2} className="field" defaultValue={service.description} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={`price-${service.id}`}>Price range</label>
          <input id={`price-${service.id}`} name="price_range" className="field" defaultValue={service.price_range} />
        </div>
        <div>
          <label className="field-label" htmlFor={`dur-${service.id}`}>Duration</label>
          <input id={`dur-${service.id}`} name="duration" className="field" defaultValue={service.duration} />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Submit />
        {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
        {state?.success && <p className="text-sm text-emerald-700">{state.success}</p>}
      </div>
    </form>
  );
}

export default function ServicesManager({ services }) {
  return services.map((s) => <ServiceForm key={s.id} service={s} />);
}
