// ============================================================
// K2 CONTRACTORS — Site constants
// Change SITE below whenever the customer confirms real values.
// (address & phone are placeholders extracted from the reference site.)
// ============================================================

export const SITE = {
  name: "K2 Contractors",
  tagline: "Precision handyman & remodeling services",
  logo: "/assets/K2_logo.png",   // drop your logo file at public/assets/K2_logo.png — header & footer pick it up automatically
  qr: "/assets/K2_Qr.png",       // QR code shown on the hero banner — file lives at public/assets/K2_Qr.png
  phone: "(314) 623-3958",
  email: "yourstlcontractor@gmail.com",
  instagram: "k2contractors",
  instagramUrl: "https://instagram.com/k2contractors",
  address: "St. Louis, MO — Residential & Commercial", // TODO: replace with full street address if you want it shown
};

// Full list of services offered (from the K2 flyer).
// Shown as a capabilities grid on the homepage services section.
export const ALL_SERVICES = [
  "Electrical",
  "Plumbing",
  "Kitchen Remodeling",
  "Bathroom Remodeling",
  "Finished Basements",
  "Tiles / Brick",
  "Concrete",
  "Carpentry",
  "Flooring",
  "Painting",
  "Drywall",
  "Windows / Doors",
  "Landscaping",
  "Fencing / Ponds",
  "Decking / Sprinklers",
  "AC / HVAC",
  "Furniture Assembly",
  "Alarms / CCTV",
  "Handyman Services",
];

// Booking window: hourly slots between these times. Change to match hours.
// (Reference lists Mon–Fri 8am–6pm, Sat 9am–2pm — we use one shared window.)
export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export const CLOSED_WEEKDAY = 0; // 0 = Sunday

export const PORTFOLIO_CATEGORIES = [
  { key: "kitchen", label: "Kitchens" },
  { key: "bath", label: "Bathrooms" },
  { key: "repairs", label: "Repairs" },
];

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled", "declined"];

// Service-specific form options. option_1 / option_2 map to booking columns.
export const SERVICE_FORMS = {
  repair: {
    option1: { label: "Type of repair", choices: ["Electrical", "Plumbing", "Carpentry", "Flooring", "Painting", "Drywall", "Windows / Doors", "AC / HVAC", "Alarms / CCTV", "Furniture assembly", "Handyman / other"] },
    option2: { label: "Urgency", choices: ["Emergency (24h)", "This week", "Flexible"] },
  },
  remodel: {
    option1: { label: "Space to remodel", choices: ["Kitchen", "Bathroom", "Finished basement", "Tiles / Brick", "Concrete", "Living area", "Whole home"] },
    option2: { label: "Budget range", choices: ["Under $10k", "$10k - $25k", "$25k - $60k", "$60k+"] },
  },
  addition: {
    option1: { label: "Type of addition", choices: ["Extra room", "Second floor", "Garage", "Deck / patio", "Fencing / Ponds", "Landscaping / Sprinklers", "In-law suite"] },
    option2: { label: "Approximate size", choices: ["Under 200 sq ft", "200 - 500 sq ft", "500 - 1000 sq ft", "1000+ sq ft"] },
  },
};

export const PROPERTY_TYPES = ["House", "Apartment / condo", "Townhouse", "Commercial"];

export function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}