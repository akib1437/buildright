"use client";
import { useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Img from "@/components/Img";
import {
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/controllers/portfolioController";
import { PORTFOLIO_CATEGORIES } from "@/lib/constants";

function Submit({ label }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn-amber text-xs !py-2.5" disabled={pending}>
      {pending ? "Saving…" : label}
    </button>
  );
}

function Feedback({ state }) {
  if (state?.error) return <p className="text-sm text-red-700">{state.error}</p>;
  if (state?.success) return <p className="text-sm text-emerald-700">{state.success}</p>;
  return null;
}

function AddForm() {
  const [state, action] = useFormState(addPortfolioItem, {});
  return (
    <form action={action} className="card p-5 grid gap-3 sm:grid-cols-2">
      <p className="sm:col-span-2 dim-line dim-line--tick"><span>add a project</span></p>
      <div>
        <label className="field-label" htmlFor="np-title">Title</label>
        <input id="np-title" name="title" className="field" required maxLength={120} />
      </div>
      <div>
        <label className="field-label" htmlFor="np-cat">Category</label>
        <select id="np-cat" name="category" className="field" required defaultValue="">
          <option value="" disabled>Select…</option>
          {PORTFOLIO_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="np-url">Image URL (https)</label>
        <input id="np-url" name="image_url" className="field" required placeholder="https://…" />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label" htmlFor="np-desc">Short description</label>
        <input id="np-desc" name="description" className="field" maxLength={300} />
      </div>
      <div className="sm:col-span-2 flex items-center gap-4">
        <Submit label="Add project" />
        <Feedback state={state} />
      </div>
    </form>
  );
}

function EditForm({ item, onDone }) {
  const [state, action] = useFormState(updatePortfolioItem, {});
  return (
    <form action={action} className="grid gap-3 p-4 bg-paper border-t border-line">
      <input type="hidden" name="id" value={item.id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="title" className="field" defaultValue={item.title} required maxLength={120} aria-label="Title" />
        <select name="category" className="field" defaultValue={item.category} aria-label="Category">
          {PORTFOLIO_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>
      <input name="image_url" className="field" defaultValue={item.image_url} required aria-label="Image URL" />
      <input name="description" className="field" defaultValue={item.description} maxLength={300} aria-label="Description" />
      <div className="flex items-center gap-3">
        <Submit label="Save changes" />
        <button type="button" className="btn-ghost text-xs !py-2.5" onClick={onDone}>Close</button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

function ItemCard({ item }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  return (
    <article className="card overflow-hidden">
      <Img src={item.image_url} alt={item.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display font-bold text-sm">{item.title}</span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-blueprint">{item.category}</span>
        </div>
        {item.description && <p className="mt-1 text-xs text-ink-soft line-clamp-2">{item.description}</p>}
        <div className="mt-3 flex gap-3 font-mono text-[0.64rem] uppercase tracking-[0.12em]">
          <button className="text-blueprint hover:underline" onClick={() => setEditing(!editing)}>
            {editing ? "Close" : "Edit"}
          </button>
          <button
            className="text-red-700 hover:underline disabled:opacity-40"
            disabled={pending}
            onClick={() => {
              if (confirm(`Delete "${item.title}" from the portfolio?`))
                start(() => deletePortfolioItem(item.id));
            }}
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
      {editing && <EditForm item={item} onDone={() => setEditing(false)} />}
    </article>
  );
}

export default function PortfolioManager({ items }) {
  const [filter, setFilter] = useState("all");
  const shown = items.filter((i) => filter === "all" || i.category === filter);
  return (
    <div className="space-y-8">
      <AddForm />
      <div className="flex items-center gap-2 flex-wrap">
        {["all", ...PORTFOLIO_CATEGORIES.map((c) => c.key)].map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`font-mono text-[0.66rem] uppercase tracking-[0.16em] px-3 py-1.5 border ${
              filter === k ? "bg-ink text-paper border-ink" : "border-line text-ink-soft hover:border-ink"
            }`}
          >
            {k}
          </button>
        ))}
        <span className="ml-auto font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-soft">
          {shown.length} items
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
