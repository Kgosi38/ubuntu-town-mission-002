"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  async function signOut() {
    await getSupabase().auth.signOut();
  }

  return (
    <>
      <header className="shell-header">
        <Link href="/" className="brand">Skills in my town</Link>
        <nav aria-label="Main">
          <Link href="/new/" className="nav-link">Post</Link>
          {user ? (
            <>
              <Link href="/mine/" className="nav-link">Mine</Link>
              <button className="nav-link nav-button" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link href="/login/" className="nav-link">Sign in</Link>
          )}
        </nav>
      </header>
      <main className="shell-main">{children}</main>
    </>
  );
}
