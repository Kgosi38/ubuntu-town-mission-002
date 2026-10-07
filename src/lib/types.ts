// Data contracts: the shapes the UI and the database agree on.

export const CATEGORIES = ["plumbing", "tutoring", "hair", "sewing", "repairs", "other"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  plumbing: "Plumbing",
  tutoring: "Tutoring",
  hair: "Hair",
  sewing: "Sewing",
  repairs: "Repairs",
  other: "Other",
};

export type SkillKind = "offer" | "request";
export type SkillStatus = "active" | "withdrawn";

/** A skill listing as the app uses it (camelCase). Never contains the phone number. */
export interface Skill {
  id: number;
  ownerId: string;
  name: string;
  category: Category;
  town: string;
  description: string;
  services: string[];
  kind: SkillKind;
  status: SkillStatus;
  createdAt: string;
}

/** What the form collects. `services` is comma-separated text; the data layer turns it into an array. */
export interface SkillInput {
  name: string;
  category: Category;
  town: string;
  description: string;
  services: string;
  phone: string;
  kind: SkillKind;
}

export interface SkillFilters {
  town?: string;
  category?: Category;
  kind?: SkillKind;
  query?: string;
}
