"use client";
import { useFormState, useFormStatus } from "react-dom";
import { sendMessage } from "@/controllers/messageController";

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn-amber w-full" disabled={pending}>
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, action] = useFormState(sendMessage, {});
  return (
    <form action={action} className="bg-paper text-ink p-6 sm:p-8 space-y-4">
      <div>
        <label className="field-label" htmlFor="c-name">Name</label>
        <input id="c-name" name="name" className="field" required maxLength={120} />
      </div>
      <div>
        <label className="field-label" htmlFor="c-email">Email</label>
        <input id="c-email" name="email" type="email" className="field" required maxLength={200} />
      </div>
      <div>
        <label className="field-label" htmlFor="c-body">What do you need done?</label>
        <textarea id="c-body" name="body" rows={4} className="field" required maxLength={3000} />
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-700">{state.success}</p>}
      <SendButton />
    </form>
  );
}
