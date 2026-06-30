# WDD Agent Runbook

This repository uses Wiki-Driven Development.

## Required Cadence

For product or domain changes:

1. **Wiki phase first.** Edit the owning wiki node Markdown file and impacted wiki nodes before code.
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
- Treat GitHub Markdown rendering of `wiki/*.md` as the default user-facing reading surface.
- Treat any HTML rendering output as an optional derived artifact, not as product truth.
- Do not add `/wiki` routes back into product apps unless the project explicitly chooses to serve a derived reading surface.
- When reporting work, translate command results into wiki-visible status: current phase, code reflection, verification state, impacted wiki nodes, impacted code files, and QA screenshots.
- Do not invent human status prose. The `## 상태` line must match the canonical text derived from `wdd_status`.
- If a user asks what to do next, point them to the wiki node status and screenshots first; mention commands only for developers or CI maintainers.

## GitHub Issue Entry Point

- Treat product wiki nodes as the current product SSOT, not as an active task board.
- For user-requested changes, capture the request in a GitHub issue using `.github/ISSUE_TEMPLATE/wdd-change.md`.
- If the user points at a product wiki node and asks to modify it, the issue should name the target wiki nodes and proposed wiki patch before product wiki files change.
- When picking up an issue, assign it or mark it in GitHub, create a branch/worktree, then follow the required cadence: product wiki patch -> coding -> verification -> PR.
- The PR must contain the product wiki changes, code changes, verification evidence, and refreshed screenshots for reflected screen nodes.
- For large requests, split the issue into dependency-aware child issues or checklist items. Parallel work happens on independent branches/worktrees and merges through PRs.

## Project-Neutral Harness Rules

- `harness` must not depend on the booking domain.
- `harness/templates/` must use placeholders such as `<appRoot>` and `<wikiRoot>`, not pilot-specific paths.
- Historical implementation plans should not become durable truth. Keep reusable decisions in README, AGENTS, templates, wiki metadata, harness tests, or GitHub issue/PR templates.
- The pilot app is a dogfood project, not a special case.
- Temporary debugging tests or routes should not be committed. Permanent tests must verify wiki-backed behavior.

## Visual Evidence

- Reflected screen nodes must declare `screenshots`.
- A screenshot is QA evidence, not decoration.
- After E2E passes, refresh screen screenshots through the project QA command.
- `wdd drift` and `wdd ready` should catch missing screenshot files.
