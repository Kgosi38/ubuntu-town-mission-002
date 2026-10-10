"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { fetchPhone } from "@/lib/skills";
import { useAuth } from "@/lib/auth";
import { CATEGORY_LABELS, type Skill } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  skill: Skill;
  actions?: ReactNode;
}

export function SkillCard({ skill, actions }: Props) {
  const { user } = useAuth();
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function showPhone() {
    setBusy(true);
    setError("");
    try {
      setPhone(await fetchPhone(skill.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the phone number.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card">
      <div className="card-top">
        <StatusBadge kind={skill.kind} status={skill.status} />
        <span className="meta">{CATEGORY_LABELS[skill.category]} · {skill.town}</span>
      </div>
      <h3>{skill.name}</h3>
      <p>{skill.description}</p>
      {skill.services.length > 0 ? (
        <ul className="chips">{skill.services.map((s) => <li key={s}>{s}</li>)}</ul>
      ) : null}
      {actions}
      {!actions && (
        user ? (
          phone ? <p className="contact">{phone}</p> : (
            <button className="btn" onClick={showPhone} disabled={busy}>{busy ? "Loading…" : "Show phone number"}</button>
          )
        ) : (
          <Link className="btn btn-quiet" href="/login/">Sign in to see phone number</Link>
        )
      )}
      {error ? <p className="hint-error" role="alert">{error}</p> : null}
    </article>
  );
}
