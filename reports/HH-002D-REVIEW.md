# My review of the Hermes mobile report (HH-002D)

Hermes's report is saved unchanged in reports/HH-002D.md. Below is what I decided about each finding. I checked the code claims with grep.

## 1. Edit page does not save drafts (Hermes: problem)
- I agree. grep shows no draftKey in src/app/edit/page.tsx.
- Hermes's fix uses one fixed key, so a draft from one listing could appear in another. The key must include the listing id.
- I treated it as low priority. The brief's draft requirement is about writing a new signal, and that already works.
- Not fixed yet.

## 2. Edit page error has no retry button (Hermes: problem)
- I agree. grep shows no onRetry in the edit page.
- Hermes's fix is incomplete: the old error would stay on screen after a retry unless it is cleared first.
- Not fixed yet.

## 3. Could not verify the viewport tag (Hermes: out of scope)
- Already handled. src/app/layout.tsx line 12 sets width device-width and initialScale 1.
- Hermes could not see it because I did not allow that file in the scope. That was my mistake, not its.

## What Hermes got right
- It stayed inside the files I allowed this time.
- It said clearly what it could not verify.
- The "verified OK" items (touch targets, no sideways scrolling, loading and error states, draft saving on new posts) match what I saw on my phone. I should confirm each of these again before the demo.

## What I would change next time
- Allow layout.tsx in the scope.
- Ask for fixes that include the edge cases (keys per listing, clearing old errors).
