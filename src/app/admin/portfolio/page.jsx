import PortfolioManager from "@/components/admin/PortfolioManager";
import { createClient } from "@/lib/supabase/server";
import { portfolioModel } from "@/models/portfolioModel";

export const revalidate = 0;

export default async function AdminPortfolioPage() {
  const supabase = createClient();
  const items = await portfolioModel.listAll(supabase);
  return (
    <main>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">admin · portfolio</p>
      <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">Project photos</h1>
      <p className="mt-2 text-sm text-ink-soft max-w-2xl">
        Add, edit or remove the projects shown on the public portfolio page. Paste a full
        image URL (any https image works — Supabase Storage, Unsplash, your own host).
      </p>
      <div className="mt-8">
        <PortfolioManager items={items} />
      </div>
    </main>
  );
}
