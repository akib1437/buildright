"use client";
import { useEffect, useRef, useState } from "react";

/**
 * A stat that counts up from 0 to `to` once it enters the viewport.
 * `prefix` and `suffix` render around the number ("$", "+", "yr").
 */
export default function StatCounter({ to, suffix = "", prefix = "", duration = 1400, label }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <div ref={ref}>
      <p className="font-display font-black text-4xl sm:text-5xl text-amber leading-none tabular-nums">
        {prefix}{value.toLocaleString()}{suffix}
      </p>
      {label && (
        <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-paper/60">
          {label}
        </p>
      )}
    </div>
  );
}
