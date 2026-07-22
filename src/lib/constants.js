// ============================================================
// K2 CONTRACTORS LLC — Public business details
// These values come from the supplied K2 marketing materials.
// No street address or business hours were provided.
// ============================================================

export const SITE = {
  name: "K2 Contractors LLC",
  shortName: "K2 Contractors",
  tagline: "We Make It Happen",
  description:
    "Residential and commercial construction, remodeling, repair, and handyman services.",
  logo: "/assets/K2_logo.png",
  qr: "/assets/K2_Qr.png",
  phone: "(314) 623-3958",
  phoneHref: "tel:+13146233958",
  email: "yourstlcontractor@gmail.com",
  emailHref: "mailto:yourstlcontractor@gmail.com",
  instagram: "k2contractors",
  instagramUrl: "https://instagram.com/k2contractors",
  serviceArea: "St. Louis, Missouri",
  address: "Serving the St. Louis area",
  companyType: "Residential & Commercial",
  estimateLabel: "Free estimate",
};

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
  "Window / Doors",
  "Landscaping",
  "Fencing / Ponds",
  "Decking / Sprinklers",
  "AC / HVAC",
  "Furniture Assembly",
  "Alarms / CCTV",
  "Handyman Services",
];

// Public-facing copy is kept here instead of relying on old database seed text.
export const SERVICE_CATEGORIES = {
  repair: {
    name: "Repairs & Handyman",
    tagline: "No job too big or small",
    description:
      "Electrical, plumbing, carpentry, flooring, painting, drywall, window and door work, AC/HVAC, alarms/CCTV, furniture assembly, and general handyman services.",
  },
  remodel: {
    name: "Remodeling & Interior Work",
    tagline: "Kitchens, bathrooms, basements and more",
    description:
      "Kitchen remodeling, bathroom remodeling, finished basements, tile and brick work, concrete, flooring, painting, and drywall.",
  },
  addition: {
    name: "Exterior & Property Work",
    tagline: "Build, improve and maintain",
    description:
      "Landscaping, fencing, ponds, decking, sprinklers, concrete, carpentry, and other residential or commercial property improvements.",
  },
};

// These are request windows, not published business hours.
export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

// No weekly closure was supplied in the provided business materials.
export const CLOSED_WEEKDAY = null;

export const PORTFOLIO_CATEGORIES = [
  { key: "kitchen", label: "Kitchens" },
  { key: "bath", label: "Bathrooms" },
  { key: "repairs", label: "Repairs" },
];

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled", "declined"];

export const SERVICE_FORMS = {
  repair: {
    option1: {
      label: "Type of work",
      choices: [
        "Electrical",
        "Plumbing",
        "Carpentry",
        "Flooring",
        "Painting",
        "Drywall",
        "Window / Doors",
        "AC / HVAC",
        "Alarms / CCTV",
        "Furniture Assembly",
        "Handyman / Other",
      ],
    },
    option2: {
      label: "Preferred timing",
      choices: ["As soon as possible", "This week", "Flexible"],
    },
  },
  remodel: {
    option1: {
      label: "Space or work type",
      choices: [
        "Kitchen",
        "Bathroom",
        "Finished Basement",
        "Tiles / Brick",
        "Concrete",
        "Flooring",
        "Painting / Drywall",
        "Other",
      ],
    },
    option2: {
      label: "Budget range",
      choices: ["Not sure yet", "Under $10k", "$10k - $25k", "$25k - $60k", "$60k+"],
    },
  },
  addition: {
    option1: {
      label: "Property work",
      choices: [
        "Landscaping",
        "Fencing / Ponds",
        "Decking / Sprinklers",
        "Concrete / Brick",
        "Carpentry",
        "Other",
      ],
    },
    option2: {
      label: "Approximate size",
      choices: ["Not sure yet", "Under 200 sq ft", "200 - 500 sq ft", "500 - 1000 sq ft", "1000+ sq ft"],
    },
  },
};

export const PROPERTY_TYPES = ["House", "Apartment / Condo", "Townhouse", "Commercial"];

export function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
