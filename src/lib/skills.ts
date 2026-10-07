import { getSupabase } from "./supabase";
import type { Category, Skill, SkillFilters, SkillInput, SkillKind, SkillStatus } from "./types";

// Columns anonymous visitors are allowed to read. phone_number is deliberately NOT here.
const PUBLIC_COLUMNS = "id, owner_id, name, category, town, description, services, kind, status, created_at";

interface SkillRow {
  id: number;
  owner_id: string;
  name: string;
  category: Category;
  town: string;
  description: string;
  services: string[];
  kind: SkillKind;
  status: SkillStatus;
  created_at: string;
}

function toSkill(row: SkillRow): Skill {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    category: row.category,
    town: row.town,
    description: row.description,
    services: row.services ?? [],
    kind: row.kind,
    status: row.status,
    createdAt: row.created_at,
  };
}

/** Strip characters that have special meaning inside a PostgREST filter string. */
function safeSearch(text: string): string {
  return text.replace(/[%*,()\\]/g, " ").trim();
}

function parseServices(text: string): string[] {
  return text.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 8);
}

/** Public browse: active listings only (RLS enforces this too). */
export async function fetchSkills(filters: SkillFilters): Promise<Skill[]> {
  let q = getSupabase()
    .from("skills")
    .select(PUBLIC_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(50);
  if (filters.category) q = q.eq("category", filters.category);
  if (filters.kind) q = q.eq("kind", filters.kind);
  const town = filters.town ? safeSearch(filters.town) : "";
  if (town) q = q.ilike("town", `%${town}%`);
  const text = filters.query ? safeSearch(filters.query) : "";
  if (text) q = q.or(`name.ilike.%${text}%,description.ilike.%${text}%`);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as SkillRow[]).map(toSkill);
}

/** The signed-in user's own listings, including withdrawn ones (RLS: owners can read their own). */
export async function fetchMySkills(userId: string): Promise<Skill[]> {
  const { data, error } = await getSupabase()
    .from("skills")
    .select(PUBLIC_COLUMNS)
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as SkillRow[]).map(toSkill);
}

export async function fetchSkill(id: number): Promise<Skill> {
  const { data, error } = await getSupabase().from("skills").select(PUBLIC_COLUMNS).eq("id", id).single();
  if (error) throw new Error(error.message);
  return toSkill(data as unknown as SkillRow);
}

/** Phone number: only works when signed in. Anonymous requests are refused by the database. */
export async function fetchPhone(id: number): Promise<string> {
  const { data, error } = await getSupabase().from("skills").select("phone_number").eq("id", id).single();
  if (error) throw new Error(error.message);
  return (data as { phone_number: string }).phone_number;
}

export async function createSkill(userId: string, input: SkillInput): Promise<void> {
  const { error } = await getSupabase().from("skills").insert({
    owner_id: userId,
    name: input.name.trim(),
    category: input.category,
    town: input.town.trim(),
    description: input.description.trim(),
    services: parseServices(input.services),
    phone_number: input.phone.trim(),
    kind: input.kind,
  });
  if (error) throw new Error(error.message);
}

export async function updateSkill(id: number, input: SkillInput): Promise<void> {
  const { error } = await getSupabase()
    .from("skills")
    .update({
      name: input.name.trim(),
      category: input.category,
      town: input.town.trim(),
      description: input.description.trim(),
      services: parseServices(input.services),
      phone_number: input.phone.trim(),
      kind: input.kind,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Withdraw = soft delete (status). Restore = back to active. Nothing is destroyed. */
export async function setWithdrawn(id: number, withdrawn: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from("skills")
    .update({ status: withdrawn ? "withdrawn" : "active" })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
