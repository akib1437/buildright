"use client";
import { useMemo, useState, useTransition } from "react";
import StatusBadge from "@/components/StatusBadge";
import {
  adminSetBookingStatus,
  adminDeleteBooking,
} from "@/controllers/bookingController";
import { BOOKING_STATUSES, formatDate } from "@/lib/constants";

const SERVICE_LABEL = { repair: "Repair", remodel: "Remodel", addition: "Addition" };

function ActionButton({ label, tone = "ghost", onClick, disabled }) {
  const cls =
    tone === "amber"
      ? "bg-amber text-ink hover:bg-amber-deep"
      : tone === "danger"
      ? "border border-red-700/40 text-red-700 hover:bg-red-700 hover:text-white"
      : "border border-ink/25 hover:border-ink";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-mono text-[0.64rem] uppercase tracking-[0.12em] px-2.5 py-1.5 transition-colors disabled:opacity-40 ${cls}`}
    >
      {label}
    </button>
  );
}

function BookingRow({ b }) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState(b.admin_note || "");
  const [showNote, setShowNote] = useState(false);

  const set = (status) => start(() => adminSetBookingStatus(b.id, status));

  return (
    <article className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-display font-bold">{SERVICE_LABEL[b.service_slug] || b.service_slug}</span>
            <StatusBadge status={b.status} />
            <span className="font-mono text-sm text-blueprint">
              {formatDate(b.booking_date)} · {b.time_slot}
            </span>
          </div>
          <p className="mt-1.5 text-sm">
            <span className="font-semibold">{b.profiles?.full_name || "Customer"}</span>
            <span className="text-ink-soft"> · {b.phone || b.profiles?.phone || "no phone"}</span>
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {[b.option_1, b.option_2, b.property_type].filter(Boolean).join(" · ")}
          </p>
          {b.address && <p className="mt-1 text-sm text-ink-soft">📍 {b.address}</p>}
          {b.details && <p className="mt-2 text-sm border-l-2 border-line pl-3">{b.details}</p>}
          {b.admin_note && !showNote && (
            <p className="mt-2 text-sm border-l-2 border-amber pl-3 text-ink-soft">Note: {b.admin_note}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {b.status === "pending" && (
            <>
              <ActionButton label="Confirm" tone="amber" disabled={pending} onClick={() => set("confirmed")} />
              <ActionButton label="Decline" tone="danger" disabled={pending} onClick={() => set("declined")} />
            </>
          )}
          {b.status === "confirmed" && (
            <>
              <ActionButton label="Mark completed" tone="amber" disabled={pending} onClick={() => set("completed")} />
              <ActionButton label="Cancel" disabled={pending} onClick={() => set("cancelled")} />
            </>
          )}
          {["completed", "cancelled", "declined"].includes(b.status) && (
            <ActionButton label="Reopen" disabled={pending} onClick={() => set("pending")} />
          )}
          <ActionButton label={showNote ? "Close note" : "Note"} disabled={pending} onClick={() => setShowNote(!showNote)} />
          <ActionButton
            label="Delete"
            tone="danger"
            disabled={pending}
            onClick={() => {
              if (confirm("Permanently delete this booking?")) start(() => adminDeleteBooking(b.id));
            }}
          />
        </div>
      </div>

      {showNote && (
        <div className="mt-4 flex gap-2">
          <input
            className="field"
            value={note}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Visible to the customer on their dashboard"
          />
          <button
            className="btn-ink !py-2 text-xs shrink-0"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await adminSetBookingStatus(b.id, b.status, note);
                setShowNote(false);
              })
            }
          >
            Save note
          </button>
        </div>
      )}
    </article>
  );
}

export default function ScheduleManager({ bookings, initialStatus }) {
  const [status, setStatus] = useState(initialStatus || "all");
  const [date, setDate] = useState("");
  const [service, setService] = useState("all");

  const filtered = useMemo(
    () =>
      bookings.filter(
        (b) =>
          (status === "all" || b.status === status) &&
          (service === "all" || b.service_slug === service) &&
          (!date || b.booking_date === date)
      ),
    [bookings, status, date, service]
  );

  return (
    <div>
      <div className="card p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="field-label" htmlFor="f-status">Status</label>
          <select id="f-status" className="field !w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="f-service">Service</label>
          <select id="f-service" className="field !w-44" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="all">All services</option>
            <option value="repair">Repair</option>
            <option value="remodel">Remodel</option>
            <option value="addition">Addition</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="f-date">Date</label>
          <input id="f-date" type="date" className="field !w-44" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        {(status !== "all" || service !== "all" || date) && (
          <button
            className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-blueprint underline pb-3"
            onClick={() => { setStatus("all"); setService("all"); setDate(""); }}
          >
            Clear filters
          </button>
        )}
        <p className="ml-auto font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft pb-3">
          {filtered.length} of {bookings.length} bookings
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-ink-soft text-sm py-8 text-center">No bookings match these filters.</p>
        ) : (
          filtered.map((b) => <BookingRow key={b.id} b={b} />)
        )}
      </div>
    </div>
  );
}
