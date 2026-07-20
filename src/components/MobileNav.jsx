"use client";
import { useState } from "react";
import Link from "next/link";

/**
 * Hamburger menu shown only below md. Renders a solid dropdown panel
 * under the fixed header so links stay readable over the hero photo.
 */
export default function MobileNav({ links = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="header-links grid place-items-center w-10 h-10 -mr-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav className="absolute top-16 inset-x-0 bg-paper text-ink border-b border-line shadow-xl flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-5 py-4 font-mono text-[0.72rem] uppercase tracking-[0.18em] border-t border-line hover:bg-ink hover:text-paper transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}