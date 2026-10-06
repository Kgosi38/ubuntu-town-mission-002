# HH-002A Report — Schema Critique

## What Hermes said
- Claimed a "critical gap": owners cannot see their own withdrawn skills.
- Claimed the two SELECT policies were redundant.
- Flagged a missing index on owner_id.

## What I verified myself
Ran `cat supabase/migrations/20261004_create_skills.sql` and checked policy 2 directly.
Policy 2 ("owners can read their own skills") only checks `auth.uid() = owner_id`, with no status condition — so owners CAN already see their withdrawn rows. Hermes's "critical gap" claim was wrong.
The two policies are not redundant either: policies combine with OR. Policy 1 covers public access to active rows; policy 2 covers owner access regardless of status. They do different jobs.

## What I accepted
- Missing index on owner_id — valid, added `create index on public.skills (owner_id);`
- UPDATE policy only had `using`, no `with check` — added an explicit `with check (auth.uid() = owner_id)` so an owner can't reassign owner_id to someone else.

## What I rejected
- The "critical gap" claim about withdrawn rows being invisible to owners — disproven by reading the actual policy SQL.

## Security note
The public SELECT policy exposes every column of active rows to anonymous visitors, including phone_number. This is intentional for this app, since Contact Provider needs the number to build a WhatsApp link — documented here rather than left unexamined.

## Git status
Confirmed with `git status` that Hermes made no file changes, as the commission required (critique only).
