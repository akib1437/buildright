"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createBooking, getTakenSlots } from "@/controllers/bookingController";
import { TIME_SLOTS, CLOSED_WEEKDAY, PROPERTY_TYPES, formatDate } from "@/lib/constants";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toYMD(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function Calendar({ selected, onSelect }) {
  const today = useMemo(() => { const t = new Date(); t.setHours(0,0,0,0); return t; }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const out = [];
    for (let i = 0; i < startPad; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) out.push(new Date(view.getFullYear(), view.getMonth(), d));
    return out;
  }, [view]);

  const atCurrentMonth = view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth();

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          disabled={atCurrentMonth}
          className="btn-ghost !p-2 text-xs disabled:opacity-30"
          aria-label="Previous month"
        >←</button>
        <span className="font-display font-bold">{MONTHS[view.getMonth()]} {view.getFullYear()}</span>
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          className="btn-ghost !p-2 text-xs"
          aria-label="Next month"
        >→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[0.62rem] uppercase tracking-widest text-ink-soft mb-1.5">
        {DOW.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={`pad-${i}`} />;
          const ymd = toYMD(d);
          const disabled = d < today || d.getDay() === CLOSED_WEEKDAY;
          const isSel = selected === ymd;
          return (
            <button
              key={ymd}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(ymd)}
              aria-pressed={isSel}
              className={`aspect-square text-sm transition-colors ${
                isSel
                  ? "bg-ink text-amber font-bold"
                  : disabled
                  ? "text-ink-soft/30 cursor-not-allowed"
                  : "hover:bg-amber/25 text-ink"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-soft">
        Closed Sundays · book up to 60 days out
      </p>
    </div>
  );
}

function SubmitButton({ ready }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn-amber w-full" disabled={pending || !ready}>
      {pending ? "Booking…" : ready ? "Confirm booking request" : "Pick a date & time first"}
    </button>
  );
}

export default function BookingForm({ service, formConfig }) {
  const [state, action] = useFormState(createBooking, {});
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [taken, setTaken] = useState([]);
  const [loadingSlots, startLoading] = useTransition();

  useEffect(() => {
    if (!date) return;
    setSlot("");
    startLoading(async () => {
      try {
        setTaken(await getTakenSlots(date));
      } catch {
        setTaken([]);
      }
    });
  }, [date]);

  const ready = Boolean(date && slot);

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <input type="hidden" name="service_slug" value={service.slug} />
      <input type="hidden" name="booking_date" value={date} />
      <input type="hidden" name="time_slot" value={slot} />

      {/* left: when */}
      <div>
        <h2 className="dim-line dim-line--tick mb-4"><span>step 1 · pick a slot</span></h2>
        <Calendar selected={date} onSelect={setDate} />
        <div className="mt-5">
          <p className="field-label">
            {date ? `Times on ${formatDate(date)}` : "Times — select a date first"}
            {loadingSlots && " · checking…"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((t) => {
              const unavailable = !date || taken.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  disabled={unavailable}
                  onClick={() => setSlot(t)}
                  aria-pressed={slot === t}
                  className={`font-mono text-sm py-2.5 border transition-colors ${
                    slot === t
                      ? "bg-ink text-amber border-ink"
                      : unavailable
                      ? "border-line text-ink-soft/30 line-through cursor-not-allowed"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* right: details */}
      <div className="space-y-4">
        <h2 className="dim-line dim-line--tick mb-4"><span>step 2 · job details</span></h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="option_1">{formConfig.option1.label}</label>
            <select id="option_1" name="option_1" className="field" required defaultValue="">
              <option value="" disabled>Select…</option>
              {formConfig.option1.choices.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="option_2">{formConfig.option2.label}</label>
            <select id="option_2" name="option_2" className="field" required defaultValue="">
              <option value="" disabled>Select…</option>
              {formConfig.option2.choices.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="property_type">Property type</label>
          <select id="property_type" name="property_type" className="field" required defaultValue="">
            <option value="" disabled>Select…</option>
            {PROPERTY_TYPES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="address">Job address</label>
          <input id="address" name="address" className="field" required maxLength={300}
                 placeholder="Street address, city, state ZIP" />
        </div>

        <div>
          <label className="field-label" htmlFor="phone">Phone for day-of contact</label>
          <input id="phone" name="phone" className="field" required maxLength={40}
                 placeholder="(314) 623-3958" />
        </div>

        <div>
          <label className="field-label" htmlFor="details">Describe the work (optional)</label>
          <textarea id="details" name="details" rows={4} className="field" maxLength={2000}
                    placeholder="Anything that helps us bring the right tools and the right person." />
        </div>

        {date && slot && (
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-blueprint border border-blueprint/30 bg-blueprint/5 px-3 py-2.5">
            Requested: {formatDate(date)} · {slot}
          </p>
        )}
        {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

        <SubmitButton ready={ready} />
        <p className="text-xs text-ink-soft">
          Booking a slot sends a request — it's confirmed once our scheduler approves it,
          and you can track the status from your dashboard.
        </p>
      </div>
    </form>
  );
}
