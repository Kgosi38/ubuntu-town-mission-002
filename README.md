# Skills in my town (Ubuntu Town Mission 002)

People list a skill they offer or ask for help; neighbours browse by town and skill. Phone numbers are visible to signed-in users only.

## Run on Termux
```
npm install
cp .env.example .env.local    # fill in your Supabase URL + anon key
npm run dev
```
Apply both migrations in `supabase/migrations/` (oldest first) to your DEV Supabase project.

## Checks (same as CI)
`npm run typecheck && npm run lint && npm run build`
