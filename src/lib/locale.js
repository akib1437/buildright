// ============================================================
// LOCALE CONFIG — K2 Contractors
// Change these to relocate the business or update service info.
// ============================================================

export const LOCALE = {
  region: "Builders City",                              // hero eyebrow: "est. 2011 · {region}"
  regionShort: "Builders City",                         // areas-served headline
  serviceRadius: "the metro region",                    // FAQ text
  permitAuthority: "your local building department",    // FAQ text
};

// Optional — 24/7 emergency badge highlighted on the areas-served section.
// Set to null or "" to hide.
export const EMERGENCY_LINE = "24/7 Emergency Repair Available";

// Business hours — shown in the footer.
export const HOURS = [
  { label: "Mon – Fri", value: "8:00 am – 6:00 pm" },
  { label: "Saturday",  value: "9:00 am – 2:00 pm" },
  { label: "Sunday",    value: "Closed" },
];

// Areas served — displayed as chips. From reference: 3 broad zones.
// Add specific neighborhoods below as the customer confirms them.
export const SERVICE_AREAS = [
  "Builders City",
  "Surrounding Areas",
  "Metro Region",
  "Countywide Service",
  // Uncomment / add real neighborhoods once you have the list:
  // "Downtown", "Uptown", "West Side", "East Side",
  // "North End", "South Side", "Old Town", "Riverside",
];

// Testimonials shown in the reviews section.
// Replace with real Google/Facebook reviews when available.
export const TESTIMONIALS_DATA = [
  {
    name: "Sarah M.",
    role: "Homeowner",
    body: "Booked a kitchen remodel on a Tuesday, had a walkthrough by Friday. The K2 crew showed up on time every single day and cleaned up better than my housekeeper does.",
    rating: 5,
  },
  {
    name: "David L.",
    role: "Property manager",
    body: "We use K2 Contractors for all our apartment turnovers now. The online booking and status updates are the reason — I stopped chasing contractors on WhatsApp.",
    rating: 5,
  },
  {
    name: "Elena K.",
    role: "Homeowner",
    body: "Bathroom was gutted and rebuilt in 11 days. Zero surprises on the invoice — the fixed quote was the final price. Rare in this industry.",
    rating: 5,
  },
  {
    name: "Marcus R.",
    role: "Restaurant owner",
    body: "K2 did our second-floor addition without shutting the ground-floor cafe for a single day. Coordination was surgical.",
    rating: 5,
  },
  {
    name: "Amira J.",
    role: "Homeowner",
    body: "The estimator explained why my \"repair\" was actually a small remodel — and priced both. Honest to a fault. Went with the remodel, no regrets.",
    rating: 5,
  },
  {
    name: "Ryan T.",
    role: "Homeowner",
    body: "Electrical panel upgrade including permit paperwork. Booked online, done in one visit. The dashboard kept me posted the entire time.",
    rating: 5,
  },
];

// FAQ. `a` is a function that receives LOCALE so region-specific values
// (permit authority, service radius) stay in sync with the config above.
export const FAQ_DATA = [
  {
    q: "How fast can you get someone out for an estimate?",
    a: () => "Most repair visits are booked within 2–3 business days. Remodel and addition estimates usually land within a week — we hold two slots a day just for site visits, so the calendar rarely runs dry.",
  },
  {
    q: "Is the quote fixed or does it change mid-job?",
    a: () => "Once you approve a written quote, the price is locked. If something genuinely unforeseen shows up mid-tear-out (rotten framing behind a shower wall, for instance), we stop, show you photos, and get sign-off before spending another cent.",
  },
  {
    q: "Are you licensed and insured?",
    a: () => "Yes — licensed, bonded and insured. Trade licenses for plumbing and electrical, general liability insurance, and workers' comp on every crew member. Certificates are available on request before any larger job begins.",
  },
  {
    q: "Do you handle permits?",
    a: (L) => `For additions and major remodels, yes — we prepare drawings, submit to ${L.permitAuthority}, and handle inspector visits. For repairs and cosmetic remodels, permits usually aren't required and we'll tell you upfront.`,
  },
  {
    q: "What areas do you cover?",
    a: (L) => `We cover ${L.regionShort} and ${L.serviceRadius}, with countywide service on larger projects. If you're outside that, message us anyway; we occasionally take bigger projects further out.`,
  },
  {
    q: "Do you offer emergency repairs?",
    a: () => "Yes — 24/7 emergency repair is available for burst pipes, electrical failures, and structural issues. Call the main line for after-hours dispatch.",
  },
  {
    q: "What's your warranty?",
    a: () => "Ten years on workmanship for remodels and additions. One year on repairs. Manufacturer warranties on materials are passed through directly to you.",
  },
];
