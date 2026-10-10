"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const supabase = getSupabase();
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        if (!data.session) {
          setNotice("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <h1>{mode === "signin" ? "Sign in" : "Create account"}</h1>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
          autoComplete={mode === "signin" ? "current-password" : "new-password"} />
      </label>
      {notice ? <p className="hint-ok" role="status">{notice}</p> : null}
      {error ? <p className="hint-error" role="alert">{error}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
      </button>
      <button type="button" className="btn btn-quiet" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}>
        {mode === "signin" ? "New here? Create an account" : "Have an account? Sign in"}
      </button>
    </form>
  );
}
