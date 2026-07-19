"use client";
import { useFormState, useFormStatus } from "react-dom";
import { signIn, signUpCustomer, signUpAdmin } from "@/controllers/authController";

function Submit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn-amber w-full" disabled={pending}>
      {pending ? "One moment…" : label}
    </button>
  );
}

function Feedback({ state }) {
  if (state?.error) return <p className="text-sm text-red-700">{state.error}</p>;
  if (state?.success) return <p className="text-sm text-emerald-700">{state.success}</p>;
  return null;
}

export function LoginForm({ next }) {
  const [state, action] = useFormState(signIn, {});
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next || ""} />
      <div>
        <label className="field-label" htmlFor="identifier">Email or phone number</label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          className="field"
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="name@example.com or (314) 555-0123"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="field" required autoComplete="current-password" />
      </div>
      <Feedback state={state} />
      <Submit label="Log in" />
    </form>
  );
}

export function SignupForm() {
  const [state, action] = useFormState(signUpCustomer, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" className="field" required autoComplete="name" />
      </div>
      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="field" required autoComplete="email" />
      </div>
      <div>
        <label className="field-label" htmlFor="phone">Mobile phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="field"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="(314) 555-0123"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="password">Password (6+ characters)</label>
        <input id="password" name="password" type="password" className="field" required minLength={6} autoComplete="new-password" />
      </div>
      <Feedback state={state} />
      <Submit label="Create account" />
    </form>
  );
}

export function AdminSignupForm() {
  const [state, action] = useFormState(signUpAdmin, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="field-label" htmlFor="full_name">Full name</label>
        <input id="full_name" name="full_name" className="field" required autoComplete="name" />
      </div>
      <div>
        <label className="field-label" htmlFor="email">Work email</label>
        <input id="email" name="email" type="email" className="field" required autoComplete="email" />
      </div>
      <div>
        <label className="field-label" htmlFor="phone">Mobile phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="field"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="(314) 555-0123"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="password">Password (6+ characters)</label>
        <input id="password" name="password" type="password" className="field" required minLength={6} autoComplete="new-password" />
      </div>
      <div>
        <label className="field-label" htmlFor="admin_code">Admin signup code</label>
        <input id="admin_code" name="admin_code" type="password" className="field" required
               placeholder="Provided by the site owner" />
      </div>
      <Feedback state={state} />
      <Submit label="Create admin account" />
    </form>
  );
}
