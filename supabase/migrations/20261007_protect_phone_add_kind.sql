-- Migration 2 (builds on 20261004_create_skills.sql).
--
-- Finding: the policy "anyone can read active skills" lets anonymous visitors read EVERY column,
-- including phone_number. RLS controls which ROWS you may see, not which COLUMNS.
-- Fix: column-level privileges. Anonymous visitors may read everything except phone_number.
-- Signed-in users (role "authenticated") keep full read access to visible rows.

-- 1. A listing can be an offer ("I do plumbing") or a request ("I need a plumber").
alter table public.skills
  add column kind text not null default 'offer' check (kind in ('offer', 'request'));

-- 2. Hide phone numbers from anonymous visitors.
revoke select on public.skills from anon;
grant select (id, owner_id, name, category, town, description, services, kind, status, created_at)
  on public.skills to anon;
