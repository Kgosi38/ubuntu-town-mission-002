"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { createSkill } from "@/lib/skills";
import { SkillForm } from "@/components/SkillForm";
import { LoadingState } from "@/components/LoadingState";
import type { SkillInput } from "@/lib/types";

export default function NewSkillPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <LoadingState />;
  if (!user) {
    return (
      <div className="state">
        <p>Sign in to post a skill or ask for help.</p>
        <Link className="btn btn-primary" href="/login/">Sign in or create account</Link>
      </div>
    );
  }
  const userId = user.id;

  async function handle(input: SkillInput) {
    await createSkill(userId, input);
    router.push("/mine/");
  }

  return (
    <>
      <h1>Post to your town</h1>
      <SkillForm draftKey="draft:new-skill" submitLabel="Post" onSubmit={handle} />
    </>
  );
}
