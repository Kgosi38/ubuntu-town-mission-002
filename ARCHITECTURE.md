# ARCHITECTURE (rewrite the "why" lines in your own words before the demo)

```
Android + Termux -> Next.js (static export) + TypeScript -> Supabase (Auth, Postgres, RLS)
GitHub: feature branch -> PR -> quality.yml -> Cloudflare preview -> human review -> main -> production
```

## Layers
- **Next.js/React:** routes are folders in `src/app`; components in `src/components`; state is `useState` inside pages. Static export, so Cloudflare only serves files.
- **TypeScript:** `src/lib/types.ts` is the contract between UI and database. `src/lib/skills.ts` maps database rows (snake_case) to `Skill` (camelCase).
- **Supabase:** Postgres holds the truth, Auth proves who you are, RLS decides what you may touch. The browser only holds the public anon key.
- **GitHub Actions:** typecheck, lint, build on every PR.
- **Cloudflare:** preview URL per PR; production only from `main`.

## Data model
One table, `skills` (migration `20261004_create_skills.sql`), plus `kind` (offer/request) added in `20261007_protect_phone_add_kind.sql`.

## Decisions to defend
- **Withdraw = `status = 'withdrawn'`**, no delete policy: town evidence should not vanish.
- **Phone number hidden from anonymous visitors** with column-level privileges, because RLS only filters rows, not columns.
- **Draft persistence = localStorage:** survives refresh/offline on this phone; not synced across devices and lost if browser data is cleared.
- **Static export:** simplest hosting; trade-off is no server-side secrets, so anything privileged (e.g. AI calls) needs an edge function.
- **Town is free text:** simple, but spelling variants ("Mamelodi" vs "mamelodi east") break filtering. A `towns` table is the fix at scale.
