import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { SignupForm } from "@/components/AuthForms";
import { SITE } from "@/lib/constants";

export const metadata = { title: `Create account — ${SITE.name}` };

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="customer account"
      title="Create your account"
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="text-blueprint underline">Log in</Link>
          <span className="mx-2 text-line">·</span>
          <Link href="/signup/admin" className="text-ink-soft underline">Staff signup</Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
