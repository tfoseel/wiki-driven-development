# User-Facing WDD Browser Plan

**Goal:** Product users should understand WDD state from the wiki browser without knowing `wdd` commands.

**Decision:** Keep `wdd` as an agent/CI harness, not a user interface. The browser should translate node metadata into human-readable status, next action, impact, referenced code, verification evidence, and screenshots.

**Scope:**
- Clarify README, AGENTS, and pilot root docs so commands are described as agent/CI tools.
- Add permanent wiki-browser tests for user-facing status and impact visibility.
- Enhance the browser detail page with a status summary, next-step copy, impacted wiki/code lists, and verification evidence.
- Keep the harness project-neutral and avoid adding booking-domain assumptions.

**Verification:**
- `npm run test -w pilot-booking-app`
- `npm run e2e -w pilot-booking-app -- wiki-browser`
- `npm run ready`
