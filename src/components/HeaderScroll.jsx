"use client";
import { useEffect, useState } from "react";

/**
 * Wraps the header so it starts transparent (over a hero video) and turns
 * into the solid paper header once you scroll past ~80px.
 * On pages that pass transparent=false, it's always solid.
 */
export default function HeaderScroll({ transparent, children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!transparent) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const solid = scrolled;
  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          solid
            ? "bg-paper/95 backdrop-blur border-b border-line text-ink"
            : "bg-transparent text-paper"
        }`}
      >
        {children}
        <style>{`
          .header-links { color: ${solid ? "var(--ink-soft)" : "rgba(244,245,242,0.85)"}; }
          .header-links:hover { color: ${solid ? "var(--ink)" : "var(--amber)"}; }
          .header-cta-secondary {
            color: ${solid ? "var(--ink)" : "var(--paper)"};
            border-color: ${solid ? "rgba(16,28,34,0.2)" : "rgba(244,245,242,0.35)"};
          }
          .header-cta-secondary:hover {
            background: ${solid ? "var(--ink)" : "var(--paper)"};
            color: ${solid ? "var(--paper)" : "var(--ink)"};
          }
        `}</style>
      </header>
      {/* spacer for pages that aren't transparent (fixed header would otherwise cover content) */}
      {!transparent && <div aria-hidden className="h-16" />}
    </>
  );
}
