export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  longBio: string[];
  avatarUrl?: string;
  coverUrl?: string;
  isPerson?: boolean; // true → Person schema; false/undefined → Organization
  expertise: string[];
  focus: { label: string; value: string }[];
  social: { platform: string; url: string; label: string }[];
  editorial: {
    process: string;
    independence: string;
  };
}

// NOTE: keep every statement here factual. Do not add years of experience,
// certifications, employers or awards unless the user supplies them and they
// are true. Fabricated credentials are an E-E-A-T and FTC risk.
export const authors: Author[] = [
  {
    slug: "james-miller",
    name: "James Miller",
    role: "Lead Machine Editor",
    avatarUrl: "/authors/james-miller.webp",
    coverUrl: "/authors/james-miller-workshop.webp",
    isPerson: true,
    bio: "James Miller leads MachineFanatic's buying guides, turning spec sheets, manuals and owner feedback into clear verdicts on power tools, outdoor power equipment, shop machines and kitchen machines.",
    longBio: [
      "James Miller is the lead editor behind MachineFanatic's buying guides. His job is to read the parts of a listing most buyers skip: the rated figures under the headline number, the test conditions behind a capacity badge, the motor and pump type, and the maintenance schedule buried in the manual.",
      "Every guide he edits starts from the same question: what will this machine actually do in an ordinary garage, yard or kitchen, and what will it cost to keep running? That means separating running watts from surge watts, working pressure from max PSI and continuous motor power from peak figures, then explaining the difference in plain language.",
      "James focuses on the ownership side of a purchase as much as day one: serviceable parts, battery platforms, fuel system care, filters, seals and warranty terms. When a spec on a listing looks inconsistent or a key figure is missing, his guides say so instead of guessing.",
    ],
    expertise: [
      "Power tools and battery platforms",
      "Outdoor power equipment",
      "Portable generators and power stations",
      "Pressure washers",
      "Dehumidifiers and air treatment",
      "Kitchen machines",
    ],
    focus: [
      { label: "Role", value: "Lead Machine Editor" },
      { label: "Covers", value: "Power tools, outdoor power, shop, kitchen and home machines" },
      { label: "Method", value: "Spec sheets, manuals, owner feedback patterns" },
      { label: "Standard", value: "Rated figures over marketing figures" },
    ],
    social: [],
    editorial: {
      process:
        "Each guide compares current models side by side on their published ratings, design and documentation, then maps each machine to the buyers and jobs it suits. Claims that a listing cannot support are flagged in the copy rather than repeated.",
      independence:
        "Rankings are never sold. MachineFanatic earns affiliate commissions through Amazon links, and commission rates play no part in which machine is recommended or how it is ranked.",
    },
  },
];

export const DEFAULT_AUTHOR_SLUG = "james-miller";

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find((a) => a.name.toLowerCase() === name.toLowerCase());
}

export function getDefaultAuthor(): Author {
  return authors.find((a) => a.slug === DEFAULT_AUTHOR_SLUG)!;
}

export function authorToSlug(name: string): string {
  const match = getAuthorByName(name);
  if (match) return match.slug;
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
