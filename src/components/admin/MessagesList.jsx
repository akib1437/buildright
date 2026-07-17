"use client";
import { useTransition } from "react";
import { toggleMessageRead, deleteMessage } from "@/controllers/messageController";

function MessageCard({ m }) {
  const [pending, start] = useTransition();
  return (
    <article className={`card p-5 ${m.read ? "opacity-70" : "border-l-4 border-l-amber"}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display font-bold">{m.name}</p>
        <p className="font-mono text-[0.66rem] text-ink-soft">
          {new Date(m.created_at).toLocaleString()}
        </p>
      </div>
      <a href={`mailto:${m.email}`} className="text-sm text-blueprint hover:underline">{m.email}</a>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>
      <div className="mt-4 flex gap-4 font-mono text-[0.64rem] uppercase tracking-[0.12em]">
        <button
          className="text-blueprint hover:underline disabled:opacity-40"
          disabled={pending}
          onClick={() => start(() => toggleMessageRead(m.id, !m.read))}
        >
          Mark {m.read ? "unread" : "read"}
        </button>
        <button
          className="text-red-700 hover:underline disabled:opacity-40"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this message?")) start(() => deleteMessage(m.id));
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default function MessagesList({ messages }) {
  if (messages.length === 0) {
    return <p className="text-ink-soft text-sm">No messages yet. New contact-form messages land here.</p>;
  }
  return <div className="space-y-3">{messages.map((m) => <MessageCard key={m.id} m={m} />)}</div>;
}
