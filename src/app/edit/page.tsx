"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { fetchPhone, fetchSkill, updateSkill } from "@/lib/skills";
import { SkillForm } from "@/components/SkillForm";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import type { SkillInput } from "@/lib/types";

function EditInner() {
  const raw = useSearchParams().get("id");
  const id = raw ? Number(raw) : NaN;
  const { user, loading } = useAuth();
  const router = useRouter();
  const [initial, setInitial] = useState<SkillInput | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (Number.isNaN(id) || !user) return;
    (async () => {
      try {
        const s = await fetchSkill(id);
        if (s.ownerId !== user.id) { setError("You can only edit your own listings."); return; }
        const phone = await fetchPhone(id);
        setInitial({
          name: s.name, category: s.category, town: s.town, description: s.description,
          services: s.services.join(", "), phone, kind: s.kind,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not load this listing.");
      }
    })();
  }, [id, user]);

  if (loading) return <LoadingState />;
  if (!user) return <ErrorState message="Sign in to edit your listing." />;
  if (Number.isNaN(id)) return <ErrorState message="No listing selected." />;
  if (error) return <ErrorState message={error} />;
  if (!initial) return <LoadingState />;

  return (
    <>
      <h1>Edit listing</h1>
      <SkillForm initial={initial} submitLabel="Save changes"
        onSubmit={async (v) => { await updateSkill(id, v); router.push("/mine/"); }} />
    </>
  );
}

export default function EditPage() {
  return <Suspense fallback={<LoadingState />}><EditInner /></Suspense>;
}
