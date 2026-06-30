# WDD Agent Runbook

This repository uses Wiki-Driven Development.

## Required Cadence

For product or domain changes:

1. **Wiki phase first.** Edit the owning wiki page and impacted wiki pages before code.
2. Set impacted nodes to the current `wdd_status` phase while work is in progress.
3. Run impact/session helpers yourself to identify affected code:
   - `npm run wdd -- impact <wikiRoot> <nodeId>`
   - `npm run wdd -- session <wikiRoot> <nodeId>`
4. **Coding phase second.** Edit referenced code files. If a needed file is not referenced, update the wiki metadata first.
5. **Verification phase third.** Run declared tests, QA, screenshot capture, `wdd status`, and `wdd drift`.
6. Only mark nodes `phase: verified`, `code: reflected`, `verification: passed` after verification succeeds.

Do not leave a wiki change as verified when code or verification is still pending.

## User-Facing Rule

- Do not require product users to know or run `wdd` commands.
- Treat `wdd` commands as agent/CI harness tools.
- When reporting work, translate command results into wiki-visible status: current phase, code reflection, verification state, impacted wiki pages, impacted code files, and QA screenshots.
- If a user asks what to do next, point them to the wiki page status and screenshots first; mention commands only for developers or CI maintainers.

## Project-Neutral Harness Rules

- `packages/wdd` must not depend on the booking domain.
- `templates/` must use placeholders such as `<appRoot>` and `<wikiRoot>`, not pilot-specific paths.
- The pilot app is a dogfood project, not a special case.
- Temporary debugging tests or routes should not be committed. Permanent tests must verify wiki-backed behavior.

## Visual Evidence

- Reflected page nodes must declare `screenshots`.
- A screenshot is QA evidence, not decoration.
- After E2E passes, refresh page screenshots through the project QA command.
- `wdd drift` and `wdd ready` should catch missing screenshot files.
