"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createBooking, getTakenSlots } from "@/controllers/bookingController";
import { TIME_SLOTS, CLOSED_WEEKDAY, PROPERTY_TYPES, formatDate } from "@/lib/constants";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toYMD(d) {
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function Calendar({ selected, onSelect }) {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const [view, setView] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(
      view.getFullYear(),
      view.getMonth() + 1,
      0
    ).getDate();
    const output = [];

    for (let index = 0; index < startPad; index++) output.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      output.push(new Date(view.getFullYear(), view.getMonth(), day));
    }
    return output;
  }, [view]);

  const atCurrentMonth =
    view.getFullYear() === today.getFullYear() &&
    view.getMonth() === today.getMonth();

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          disabled={atCurrentMonth}
          className="btn-ghost !p-2 text-xs disabled:opacity-30"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="font-display font-bold">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          className="btn-ghost !p-2 text-xs"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[0.62rem] uppercase tracking-widest text-ink-soft mb-1.5">
        {DOW.map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((date, index) => {
          if (!date) return <span key={`pad-${index}`} />;

          const ymd = toYMD(date);
          const isConfiguredClosedDay =
            Number.isInteger(CLOSED_WEEKDAY) &&
            date.getDay() === CLOSED_WEEKDAY;
          const disabled = date < today || isConfiguredClosedDay;
          const isSelected = selected === ymd;

          return (
            <button
              key={ymd}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(ymd)}
              aria-pressed={isSelected}
              className={`aspect-square text-sm transition-colors ${
                isSelected
                  ? "bg-ink text-amber font-bold"
                  : disabled
                    ? "text-ink-soft/30 cursor-not-allowed"
                    : "hover:bg-amber/25 text-ink"
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-soft">
        Request dates up to 60 days out · availability is confirmed after submission
      </p>
    </div>
  );
}

function SubmitButton({ ready }) {
  const { pending } = useFormStatus();

  return (
    <button className="btn-amber w-full" disabled={pending || !ready}>
      {pending
        ? "Sending request…"
        : ready
          ? "Send estimate request"
          : "Pick a date & time first"}
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

      <div>
        <h2 className="dim-line dim-line--tick mb-4">
          <span>step 1 · request a time</span>
        </h2>
        <Calendar selected={date} onSelect={setDate} />

        <div className="mt-5">
          <p className="field-label">
            {date ? `Times on ${formatDate(date)}` : "Times — select a date first"}
            {loadingSlots && " · checking…"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((time) => {
              const unavailable = !date || taken.includes(time);

              return (
                <button
                  key={time}
                  type="button"
                  disabled={unavailable}
                  onClick={() => setSlot(time)}
                  aria-pressed={slot === time}
                  className={`font-mono text-sm py-2.5 border transition-colors ${
                    slot === time
                      ? "bg-ink text-amber border-ink"
                      : unavailable
                        ? "border-line text-ink-soft/30 line-through cursor-not-allowed"
                        : "border-line hover:border-ink"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="dim-line dim-line--tick mb-4">
          <span>step 2 · job details</span>
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="option_1">
              {formConfig.option1.label}
            </label>
            <select id="option_1" name="option_1" className="field" required defaultValue="">
              <option value="" disabled>Select…</option>
              {formConfig.option1.choices.map((choice) => (
                <option key={choice}>{choice}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label" htmlFor="option_2">
              {formConfig.option2.label}
            </label>
            <select id="option_2" name="option_2" className="field" required defaultValue="">
              <option value="" disabled>Select…</option>
              {formConfig.option2.choices.map((choice) => (
                <option key={choice}>{choice}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="property_type">Property type</label>
          <select id="property_type" name="property_type" className="field" required defaultValue="">
            <option value="" disabled>Select…</option>
            {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="address">Job address</label>
          <input
            id="address"
            name="address"
            className="field"
            required
            maxLength={300}
            placeholder="Street address, city, state ZIP"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="phone">Your callback number</label>
          <input
            id="phone"
            name="phone"
            className="field"
            required
            maxLength={40}
            placeholder="Enter your best phone number"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="details">Describe the work (optional)</label>
          <textarea
            id="details"
            name="details"
            rows={4}
            className="field"
            maxLength={2000}
            placeholder="Describe the work, current condition, measurements, or anything else K2 should know."
          />
        </div>

        {date && slot && (
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-blueprint border border-blueprint/30 bg-blueprint/5 px-3 py-2.5">
            Requested: {formatDate(date)} · {slot}
          </p>
        )}
        {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

        <SubmitButton ready={ready} />
        <p className="text-xs text-ink-soft">
          This submits a request for a free estimate. K2 Contractors LLC will confirm
          availability and next steps; status updates appear in your dashboard.
        </p>
      </div>
    </form>
  );
}
