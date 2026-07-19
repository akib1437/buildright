"use client";
import { useEffect, useState } from "react";

/**
 * HeroSlideshow
 * Cross-fades between an array of images. Each image slowly Ken-Burns-zooms.
 * Respects prefers-reduced-motion (freezes on the first image if reduced).
 *
 * Guaranteed reliable — pure CSS animation, no video hosting dependencies.
 */
export default function HeroSlideshow({
  images,
  interval = 6500,
  minH = "min-h-[92vh]",
  children,
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!images || images.length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images, interval]);

  return (
    <section className={`relative isolate ${minH} overflow-hidden bg-ink text-paper`}>
      <div className="absolute inset-0 -z-10">
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            aria-hidden
            className={`absolute inset-0 w-full h-full object-cover ken-burns transition-opacity duration-[1800ms] ease-in-out ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            // Stagger the ken-burns animation start so each image is at a
            // different point in its zoom cycle when it becomes visible.
            style={{ animationDelay: `${idx * -5.5}s` }}
          />
        ))}
        <div className="absolute inset-0 video-veil" />
        <div className="absolute inset-0 grain" />
      </div>
      {children}
    </section>
  );
}
