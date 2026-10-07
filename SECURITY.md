# SECURITY (run each test yourself and paste the real results)

| Gate | How to prove it | Result |
|---|---|---|
| User A cannot edit User B's listing | Signed in as A, update B's listing id; expect 0 rows changed | TODO |
| No service-role key in browser code | `grep -ri service_role src .env.example` prints nothing | TODO |
| No secrets in Git | `git log -p \| grep -i -E "service_role\|secret"` prints nothing | TODO |
| Public does not see phone numbers | Anonymous request for `phone_number` is refused (permission denied) | TODO |
| Public sees only active listings | Anonymous select never returns `status = withdrawn` rows | TODO |
| Authentication vs authorization | Authentication = Supabase Auth proves who you are. Authorization = RLS policies decide what that user may do. Explain with "owners can update their own skill". | TODO |

## Finding from review
`anyone can read active skills` exposed `phone_number` to anonymous visitors, because RLS limits rows, not columns. Fixed in migration `20261007_protect_phone_add_kind.sql` with column-level grants.

Rule: if Hermes suggests disabling RLS, exposing a privileged key, or skipping review "for development", reject it.
