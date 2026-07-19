import Img from "@/components/Img";

/**
 * Infinite left-scrolling row of images. We duplicate the list twice inside
 * one flex track and animate `translateX(-50%)` so it loops seamlessly.
 * Hover pauses the scroll (see .marquee-track:hover .marquee in globals.css).
 */
export default function AutoScroller({ items, height = "h-72", slow = false }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-track overflow-hidden">
      <div className={`marquee ${slow ? "marquee-slow" : ""} gap-4 py-2`}>
        {doubled.map((it, i) => (
          <figure
            key={`${it.id}-${i}`}
            className={`relative shrink-0 w-[280px] sm:w-[340px] md:w-[420px] ${height} overflow-hidden zoom-img group`}
          >
            <Img
              src={it.image_url}
              alt={it.title}
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/85 to-transparent">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber">
                {it.category}
              </p>
              <p className="mt-1 font-display font-bold text-paper text-sm sm:text-base">
                {it.title}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
