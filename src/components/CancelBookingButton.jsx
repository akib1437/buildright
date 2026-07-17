"use client";
import { useTransition } from "react";
import { cancelMyBooking } from "@/controllers/bookingController";

export default function CancelBookingButton({ id }) {
  const [pending, start] = useTransition();
  return (
    <button
      className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-red-700 hover:underline disabled:opacity-40"
      disabled={pending}
      onClick={() => {
        if (confirm("Cancel this booking request?")) start(() => cancelMyBooking(id));
      }}
    >
      {pending ? "Cancelling…" : "Cancel"}
    </button>
  );
}
