import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Log in — BuildRight" };

export default function LoginPage({ searchParams }) {
  return (
    <AuthShell
      eyebrow="log in"
      title="Welcome back"
      footer={
        <>
          New here? <Link href="/signup" className="text-blueprint underline">Create a customer account</Link>
        </>
      }
    >
      <LoginForm next={searchParams?.next} />
    </AuthShell>
  );
}
