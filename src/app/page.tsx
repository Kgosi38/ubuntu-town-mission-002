"use client";
import { useCallback, useEffect, useState } from "react";
import { fetchSkills } from "@/lib/skills";
import type { Category, Skill, SkillKind } from "@/lib/types";
import { TownInput } from "@/components/TownInput";
import { CategorySelector } from "@/components/CategorySelector";
import { SkillCard } from "@/components/SkillCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

type KindFilter = SkillKind | "";

export default function BrowsePage() {
  const [town, setTown] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [kind, setKind] = useState<KindFilter>("");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState({ town: "", query: "" });
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Wait until the person stops typing before asking the database.
  useEffect(() => {
    const t = setTimeout(() => setDebounced({ town, query }), 350);
    return () => clearTimeout(t);
  }, [town, query]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false; // ignore stale responses if filters change quickly
    setSkills(null);
    setError("");
    fetchSkills({
      town: debounced.town || undefined,
      category: category || undefined,
      kind: kind || undefined,
      query: debounced.query || undefined,
    })
      .then((rows) => { if (!cancelled) setSkills(rows); })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : "Could not load listings."); });
    return () => { cancelled = true; };
  }, [debounced, category, kind, attempt]);

  return (
    <>
      <h1>Find help or offer yours</h1>
      <div className="filters">
        <TownInput value={town} onChange={setTown} placeholder="All towns" />
        <CategorySelector value={category} onChange={setCategory} allowAll />
        <label className="field">
          <span>Show</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as KindFilter)}>
            <option value="">Offers and requests</option>
            <option value="offer">People offering skills</option>
            <option value="request">People asking for help</option>
          </select>
        </label>
        <label className="field">
          <span>Search</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. geyser, maths, braids" />
        </label>
      </div>

      {error ? <ErrorState message={error} onRetry={retry} /> : skills === null ? <LoadingState /> : skills.length === 0 ? (
        <EmptyState message="Nothing here yet. Be the first to post in this town." actionHref="/new/" actionLabel="Post a skill or request" />
      ) : (
        <div className="list">{skills.map((s) => <SkillCard key={s.id} skill={s} />)}</div>
      )}
    </>
  );
}
