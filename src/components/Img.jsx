"use client";
import { useState } from "react";

// Plain <img> with a styled fallback if a remote photo ever 404s.
export default function Img({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-ink text-paper/60 ${className}`}>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">photo unavailable</span>
      </div>
    );
  }
  return (
    <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFailed(true)} />
  );
}
