// ============================================================
// K2 CONTRACTORS — Site constants
// Change SITE below whenever the customer confirms real values.
// (address & phone are placeholders extracted from the reference site.)
// ============================================================

export const SITE = {
  name: "K2 Contractors",
  tagline: "Precision handyman & remodeling services",
  phone: "(555) 123-4567",                                       // TODO: replace with real number
  email: "info@k2contractors.com",
  address: "123 Contractor Ave, Suite 100, Builders City, BC 12345", // TODO: replace with real address
};

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
    option1: { label: "Type of repair", choices: ["Plumbing", "Electrical", "Carpentry", "Appliance", "Roof / exterior", "Other"] },
    option2: { label: "Urgency", choices: ["Emergency (24h)", "This week", "Flexible"] },
  },
  remodel: {
    option1: { label: "Space to remodel", choices: ["Kitchen", "Bathroom", "Basement", "Living area", "Whole home"] },
    option2: { label: "Budget range", choices: ["Under $10k", "$10k - $25k", "$25k - $60k", "$60k+"] },
  },
  addition: {
    option1: { label: "Type of addition", choices: ["Extra room", "Second floor", "Garage", "Deck / patio", "In-law suite"] },
    option2: { label: "Approximate size", choices: ["Under 200 sq ft", "200 - 500 sq ft", "500 - 1000 sq ft", "1000+ sq ft"] },
  },
};

export const PROPERTY_TYPES = ["House", "Apartment / condo", "Townhouse", "Commercial"];

export function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", year: "numeric",
  });
}
