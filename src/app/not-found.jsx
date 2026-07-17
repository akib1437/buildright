import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center blueprint-grid text-paper px-6">
      <div className="text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-amber">404 · not on the plans</p>
        <h1 className="mt-3 font-display font-black text-5xl">This page doesn't exist</h1>
        <Link href="/" className="btn-amber mt-8">Back to the site</Link>
      </div>
    </main>
  );
}
