# WORK-RECEIPT: Mission 002 (Signal -> Opportunity)

Apprentice: Kgosi Kgosimogogole
Product: Skills in my town, a directory where people offer a skill or ask for help, searchable by town and skill.

## Links
- Repo: https://github.com/Kgosi38/ubuntu-town-mission-002
- Production: https://ubuntu-town-mission-002.pages.dev
- Preview (PR #2): https://2be42e25.ubuntu-town-mission-002.pages.dev
- Pull requests: #1 (the app), #2 (edit page retry)

## What I noticed
People in my town have real skills (plumbing, hair, tutoring, repairs, sewing) but are found only by word of mouth or WhatsApp groups. See PRODUCT-BET.md and docs/product-sketch.jpg.

## About FixEasy
Mr Lebaka approved my idea and asked me to use FixEasy (fixeasy.ubuntutown.co.za) as a departure point and add complexity. My product bet was already written, so I kept it and built a separate app in the same direction (trades and repairs). I did not extend the FixEasy site itself. I added complexity with offers AND requests in one directory, and phone numbers only for signed-in users.

## What I built
- Next.js (static export) + TypeScript on Cloudflare Pages.
- Supabase: Auth, Postgres, Row Level Security.
- Create, read, update and withdraw of listings. Withdraw sets status = withdrawn, nothing is hard-deleted.
- Draft saving on the new-listing form, so a lost connection does not lose the text.

## Data and security
- Migrations: 20261004_create_skills.sql, 20261007_protect_phone_add_kind.sql.
- Finding: the first policy let anonymous visitors read phone_number, because RLS limits rows and not columns. I fixed it with column-level privileges.
- Tests (see SECURITY.md): a stranger could not edit my listing (0 rows changed). An anonymous read of phone_number returned permission denied (42501).
- No secret key is in the code. The app uses only the public (publishable) key, kept in .env.local, which Git ignores.

## Git, CI and deployment
- GitHub Actions runs typecheck, lint and build on every pull request.
- I broke typecheck on purpose (commit 1175bba), saw the red check, reverted it (b8abbe6) and saw green again.
- PR #2 got its own Cloudflare preview URL before it was merged. Production only changed after the merge. Preview is not production: it is a test copy of one branch.

## Hermes commissions (all read-only)
- HH-002A: critique of the schema, which led to the owner_id index and explicit update check.
- HH-002D: 360px mobile review. Reviewed in reports/HH-002D-REVIEW.md. I fixed finding 2 in PR #2.
- HH-002E: RLS red-team. Reviewed in reports/HH-002E-REVIEW.md.

## Where Hermes was wrong or incomplete
Hermes described paging that does not exist. One of its proposed fixes would have broken my edit page. It read files outside my scope list, and its first HH-002E run never wrote the report. I caught that by checking git status.

These experiences taught me that an agent's report is not enough to prove that its work is correct. I need to inspect the changed files, verify the actual behaviour, and make the final decision myself.

## How I used AI tools
Claude (chat) helped me plan the work and draft the app code, the second migration and many commands. Hermes did the three reviews. I ran everything myself, checked the results on my phone, and I need to be able to explain each part.

## Problems I hit and fixed
- Pasting SQL on my phone dropped characters (a check keyword and an equals sign). I found them from the error line numbers.
- Cloudflare build failed because my build command was typed as npx instead of npm.
- Supabase library needs Node 22, so I set NODE_VERSION to 22.
- Cloudflare did not build my branch until I triggered it again.
- Hermes on a free model paused and retried a lot, and I had to wait.

## Not done, on purpose
- The small AI-assisted interpretation experiment (brief section 10) is NOT built.
- Edit page does not save drafts (HH-002D finding 1).
- Phone numbers can be collected by any signed-in user (HH-002E finding 1).
- Database has no length limits (HH-002E finding 2).

These are known limitations, not completed features. They should be considered when deciding whether the application is ready for wider use.

## Evidence still to attach

### 1. Real-phone mobile field test
Status: Pending recording and verification.

I will record the application on my actual Android phone and check the layout at 360px width. The recording will demonstrate the homepage, browsing and filtering listings, opening the new-listing form, entering a draft, and checking whether the draft remains available after navigating away or simulating a connection interruption.

I will also demonstrate the relevant form states and record any problems encountered.

The recording must show the actual behaviour of the application. I will only claim that draft persistence works if I can demonstrate it successfully. If the test fails, I will document the limitation instead.

### 2. Ninety-second walkthrough
Status: Pending recording.

The walkthrough will demonstrate:
- The problem: Why local skills are difficult to find through word of mouth alone.
- The product: How Skills in my town lets users browse listings and find local services.
- The data: How listings are stored in Supabase.
- The engineering: The GitHub repository, pull requests, automated checks, Cloudflare preview and production deployment.
- The agent: One Hermes commission, what it did, what I reviewed, and where its findings were wrong or incomplete.
- The limitations: The improvements still needed, especially phone-number privacy, database validation and draft saving on the edit page.

The goal is to explain the application and demonstrate the evidence within approximately 90 seconds.

## What breaks at 50 towns?
If 50 towns used my application tomorrow, I think the first problems would be trust, data quality, privacy, and moderation.

People could create duplicate listings, post false information, advertise services they cannot provide, or spam the directory. As more towns join, searching and filtering by town would become more important. I would need to make sure users can identify the correct location and find relevant services without sorting through unrelated listings.

Privacy is another concern. Although phone numbers are restricted to signed-in users, any signed-in user can currently collect them. Requiring an account does not automatically make that information safe. I would need stronger controls around who can access contact details and how that information is used.

The database also has no length limits, which could allow excessively long descriptions or other unwanted input. I would introduce appropriate validation and test how the application handles invalid or unusually large submissions.

At a larger scale, I would also investigate database query efficiency, performance, backups, monitoring, connectivity, and the cost of operating the service. If many people use the app at the same time, I would need evidence that the application can handle the increased traffic reliably.

My next priorities would be to improve phone-number privacy, add input validation and moderation, and test the application with people from different towns. I would also investigate how to identify duplicate listings and how users could report suspicious or inaccurate information.

I would not assume that a successful demonstration with a few listings proves the system is ready for 50 towns. I would need real usage data, security tests, and feedback from users before expanding it.

## What I learned
This mission taught me that building an application involves more than making the interface work. I had to think about the problem, structure the data, manage authentication and permissions, test the application, and deploy changes through a controlled workflow.

I also learned that AI agents can help with engineering tasks, but their output must be reviewed. A successful build or a green automated check does not prove that the application is secure, useful, or correct.

The next stage is to complete the outstanding evidence, address the most important security limitations, and be able to explain the system and its trade-offs without relying on an AI agent to answer for me.
