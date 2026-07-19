"use client";
import { useEffect, useRef } from "react";

// Wrap any content in <Reveal> for a fade-and-rise on scroll into view.
// Add delay="1|2|3|4" for stagger effects on siblings.
export default function Reveal({ children, as: Tag = "div", delay, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["reveal", delay ? `reveal-delay-${delay}` : "", className].filter(Boolean).join(" ");
  return <Tag ref={ref} className={cls}>{children}</Tag>;
}
