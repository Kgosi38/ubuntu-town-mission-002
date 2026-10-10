"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useDraft } from "@/lib/useDraft";
import type { Category, SkillInput, SkillKind } from "@/lib/types";
import { TownInput } from "./TownInput";
import { CategorySelector } from "./CategorySelector";

const EMPTY: SkillInput = { name: "", category: "plumbing", town: "", description: "", services: "", phone: "", kind: "offer" };

interface Props {
  initial?: SkillInput;
  /** If set, the form saves a draft under this key so a dropped connection never loses the text. */
  draftKey?: string;
  submitLabel: string;
  onSubmit: (input: SkillInput) => Promise<void>;
}

export function SkillForm({ initial, draftKey, submitLabel, onSubmit }: Props) {
  const [values, setValues] = useState<SkillInput>(initial ?? EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [restored, setRestored] = useState(false);
  const [online, setOnline] = useState(true);
  const draft = useDraft<SkillInput>(draftKey);

  // Restore a saved draft once, on first load (new listings only).
  useEffect(() => {
    if (initial) return;
    const saved = draft.load();
    if (saved) { setValues(saved); setRestored(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOnline(navigator.onLine);
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  function update<K extends keyof SkillInput>(key: K, value: SkillInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    draft.save(next);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit(values);
      draft.clear(); // only clear after the server accepted it
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save. Your text is kept, try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="form">
      {!online ? <p className="banner" role="status">You are offline. Your text is saved on this phone.</p> : null}
      {restored ? <p className="banner" role="status">We restored your unfinished draft.</p> : null}

      <fieldset className="kind">
        <legend>I want to</legend>
        {(["offer", "request"] as SkillKind[]).map((k) => (
          <label key={k} className={values.kind === k ? "kind-option on" : "kind-option"}>
            <input type="radio" name="kind" checked={values.kind === k} onChange={() => update("kind", k)} />
            {k === "offer" ? "Offer my skill" : "Ask for help"}
          </label>
        ))}
      </fieldset>

      <label className="field">
        <span>{values.kind === "offer" ? "Your skill or business name" : "What do you need?"}</span>
        <input value={values.name} onChange={(e) => update("name", e.target.value)} required maxLength={80}
          placeholder={values.kind === "offer" ? "Thabo's Plumbing" : "Need a fridge repaired"} />
      </label>
      <CategorySelector value={values.category} onChange={(c) => update("category", c as Category)} />
      <TownInput value={values.town} onChange={(t) => update("town", t)} required />
      <label className="field">
        <span>Details</span>
        <textarea value={values.description} onChange={(e) => update("description", e.target.value)} required
          maxLength={600} rows={4} placeholder="What you do, where, and when you are available." />
        <small>{values.description.length}/600</small>
      </label>
      <label className="field">
        <span>Services (separate with commas)</span>
        <input value={values.services} onChange={(e) => update("services", e.target.value)} maxLength={200}
          placeholder="geyser repair, leaking taps" />
      </label>
      <label className="field">
        <span>Phone or WhatsApp (only signed-in people see this)</span>
        <input value={values.phone} onChange={(e) => update("phone", e.target.value)} required minLength={7} maxLength={30}
          inputMode="tel" autoComplete="tel" />
      </label>

      {error ? <p className="hint-error" role="alert">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={busy || !online}>{busy ? "Saving…" : submitLabel}</button>
    </form>
  );
}
