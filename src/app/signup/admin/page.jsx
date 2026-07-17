import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { AdminSignupForm } from "@/components/AuthForms";

export const metadata = { title: "Staff signup — BuildRight" };

export default function AdminSignupPage() {
  return (
    <AuthShell
      eyebrow="staff only"
      title="Admin signup"
      footer={
        <>
          This page is for BuildRight staff. You need the admin code set by the site owner.
          <br />
          <Link href="/signup" className="text-blueprint underline">Customer signup instead</Link>
        </>
      }
    >
      <AdminSignupForm />
    </AuthShell>
  );
}
