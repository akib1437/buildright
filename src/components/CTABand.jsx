"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/**
 * Big "Ready to build?" band with an optional looping video background.
 * Same fallback pattern as VideoHero: poster shows instantly, video overlays it
 * only after it starts playing.
 */
export default function CTABand({
  videoSrc,
  poster,
  eyebrow = "ready when you are",
  title,
  subtitle,
  primaryHref = "/#services",
  primaryLabel = "Schedule a visit",
  secondaryHref = "/portfolio",
  secondaryLabel = "See finished work",
}) {
  const videoRef = useRef(null);
  const [videoOk, setVideoOk] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onOk = () => setVideoOk(true);
    v.addEventListener("playing", onOk, { once: true });
    v.addEventListener("loadeddata", onOk, { once: true });
    return () => {
      v.removeEventListener("playing", onOk);
      v.removeEventListener("loadeddata", onOk);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0 -z-10">
        {poster && (
          <img
            src={poster}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${videoOk ? "" : "ken-burns"}`}
            aria-hidden="true"
          />
        )}
        {videoSrc && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoOk ? "opacity-100" : "opacity-0"}`}
            src={videoSrc}
            poster={poster}
            autoPlay muted loop playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 video-veil-band" />
        <div className="absolute inset-0 grain" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-24 sm:py-28 text-center">
        <div className="dim-line dim-line--tick dim-line--amber max-w-xs mx-auto">
          <span>{eyebrow}</span>
        </div>
        <h2 className="mt-5 hero-headline text-4xl sm:text-6xl md:text-7xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-6 max-w-2xl mx-auto text-paper/70 text-lg">{subtitle}</p>
        )}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href={primaryHref} className="btn-amber pulse">{primaryLabel}</Link>
          <Link href={secondaryHref} className="btn-ghost-light">{secondaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}
