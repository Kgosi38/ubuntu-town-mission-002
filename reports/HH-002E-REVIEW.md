# My review of the Hermes red-team report (HH-002E)

Hermes's report is saved unchanged in reports/HH-002E.md. Below is what I decided about each finding.

## 1. Phone numbers can be collected by signed-in users (Hermes said HIGH)
- I agree this is a real risk. Anyone with an account can read the phone number of any active listing.
- Hermes was wrong about how. It said to page through fetchSkills, but I searched skills.ts and there is no offset or paging. It only returns the newest 50.
- Its fixes (offset cap, rate limit in the app) would not stop a person who calls the database directly. Only a database function that checks and logs each phone lookup would.
- I did not fix this in Mission 002. It is part of my answer to what breaks at 50 towns.

## 2. No input limits in the database (Hermes said MEDIUM)
- I agree. The form limits only work in the browser. The table itself has no length checks.
- Not fixed yet. The next migration should add them.

## 3. Withdrawn listings have no filter in the app (Hermes said MEDIUM)
- I disagree. I rate it LOW and made no change.
- Every attack step starts with RLS already switched off or a key already leaked. In that case a filter in the browser code stops nothing.
- Its fix would break my Edit page, which loads withdrawn listings.

## 4. Changing the owner of a listing (Hermes said LOW)
- I agree. The update policy checks auth.uid() = owner_id before and after the change.

## What Hermes got wrong or left out
- It said paging was possible. It is not.
- One of its fixes would have broken my app.
- It read files I did not list (types.ts and the HH-002A report).
- On the first run it never wrote the report. When I resumed it, it had forgotten its earlier work. I found this by checking git status, not by trusting its summary.
- I have not checked every line number it quoted.
