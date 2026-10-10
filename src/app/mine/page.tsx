"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { fetchMySkills, setWithdrawn } from "@/lib/skills";
import type { Skill } from "@/lib/types";
import { SkillCard } from "@/components/SkillCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

export default function MySkillsPage() {
  const { user, loading } = useAuth();
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [error, setError] = useState("");
  const userId = user?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setError("");
    try {
      setSkills(await fetchMySkills(userId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load your listings.");
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  async function toggle(s: Skill) {
    try {
      await setWithdrawn(s.id, s.status === "active");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the listing.");
    }
  }

  if (loading) return <LoadingState />;
  if (!user) return <EmptyState message="Sign in to see your listings." actionHref="/login/" actionLabel="Sign in" />;

  return (
    <>
      <h1>My listings</h1>
      {error ? <ErrorState message={error} onRetry={load} /> : skills === null ? <LoadingState /> : skills.length === 0 ? (
        <EmptyState message="You have not posted anything yet." actionHref="/new/" actionLabel="Post a skill or request" />
      ) : (
        <div className="list">
          {skills.map((s) => (
            <SkillCard key={s.id} skill={s} actions={
              <div className="row">
                <Link className="btn" href={`/edit/?id=${s.id}`}>Edit</Link>
                <button className="btn btn-quiet" onClick={() => toggle(s)}>
                  {s.status === "active" ? "Withdraw" : "Restore"}
                </button>
              </div>
            } />
          ))}
        </div>
      )}
    </>
  );
}
