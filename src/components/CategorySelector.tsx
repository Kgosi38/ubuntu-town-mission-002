"use client";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/lib/types";

interface Props {
  value: Category | "";
  onChange: (c: Category | "") => void;
  allowAll?: boolean;
  label?: string;
}

export function CategorySelector({ value, onChange, allowAll, label = "Skill" }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as Category | "")}>
        {allowAll ? <option value="">All skills</option> : <option value="" disabled>Choose a skill</option>}
        {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
      </select>
    </label>
  );
}
