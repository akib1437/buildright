"use client";
import { useEffect, useRef, useState } from "react";

/**
 * VideoHero
 * Full-viewport hero with an autoplaying muted looping background video.
 * `poster` (a still image URL) shows instantly and stays if the video fails.
 * `videoSrc` is optional — if omitted or if it errors, the poster alone is
 * used with a slow ken-burns zoom so the section still feels alive.
 */
export default function VideoHero({ videoSrc, poster, minH = "min-h-[92vh]", children }) {
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
    <section className={`relative isolate ${minH} overflow-hidden bg-ink text-paper`}>
      <div className="absolute inset-0 -z-10">
        {/* poster always renders — instant paint, and it's the fallback if video fails */}
        {poster && (
          <img
            src={poster}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover ${videoOk ? "" : "ken-burns"}`}
            aria-hidden="true"
          />
        )}
        {/* video overlays the poster once it starts playing */}
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
        <div className="absolute inset-0 video-veil" />
        <div className="absolute inset-0 grain" />
      </div>
      {children}
    </section>
  );
}
