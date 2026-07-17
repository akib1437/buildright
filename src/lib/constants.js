export const SITE = {
  name: "K2 CONTRACTORS",
  tagline: "Repair. Remodel. Add on.",
  phone: "(555) 123-4567",
  email: "info@k2contractors.com",
  address: "123 Contractor Ave, Suite 100 Builders City, BC 12345",
};

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export const CLOSED_WEEKDAY = 0; // Sunday

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
