import Img from "@/components/Img";

/**
 * Infinite left-scrolling row of representative service images.
 * The list is duplicated so the CSS marquee can loop seamlessly.
 */
export default function AutoScroller({ items, height = "h-72", slow = false }) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-track overflow-hidden">
      <div className={`marquee ${slow ? "marquee-slow" : ""} gap-4 py-2`}>
        {doubled.map((item, index) => (
          <figure
            key={`${item.id}-${index}`}
            className={`relative shrink-0 w-[280px] sm:w-[340px] md:w-[420px] ${height} overflow-hidden zoom-img group`}
          >
            <Img
              src={item.image_url}
              alt={`${item.category} service example`}
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/85 to-transparent">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-amber">
                {item.category} · representative image
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
