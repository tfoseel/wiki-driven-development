# Wiki-Driven Development

Wiki-Driven Development (WDD) treats the product wiki as the SSOT. The Next.js app is not compiled deterministically from the wiki; an agent reads the wiki, updates the wiki first, traces impact, edits referenced code, and verifies the result.

## Repository Shape

```txt
apps/wiki-browser  static Next.js wiki browser for GitHub Pages-style hosting
packages/wdd/       reusable WDD harness CLI and graph checks
templates/          project-neutral wiki node templates
pilot/wiki/         dogfood wiki for the mini booking app
pilot/app/          dogfood Next.js App Router product app
wdd.config.json     project wiring for the current dogfood app
```

The pilot is intentionally inside this repository so the harness can prove that a real app can be changed by following the same workflow downstream projects should use.

## Core Cadence

Every product change follows the same order:

1. **Wiki phase:** update the wiki node that owns the behavior, plus impacted wiki nodes.
2. **Impact phase:** run `wdd impact` or read dependencies to find affected pages and files.
3. **Coding phase:** edit only the referenced code or update the wiki if ownership metadata was wrong.
4. **Verification phase:** run declared tests, E2E, QA screenshots, `wdd status`, and `wdd drift`.
5. **Verified state:** mark impacted nodes as `phase: verified`, `code: reflected`, `verification: passed`.

If work stops mid-cadence, leave `wdd_status` in the current phase. A reader should be able to see whether the wiki is implemented and verified.

## User Experience

Product users should not need to learn `wdd` commands. Their interface is the wiki browser:

- the wiki browser is a separate static Next.js app, not a route served by the product app;
- the wiki browser shows the current product wiki SSOT only;
- status shows whether the wiki is still being edited, needs code, needs verification, or is verified;
- impact shows which wiki pages and code files are affected;
- evidence shows referenced tests and QA screenshots;
- the next action tells the agent what phase should happen next.

The `wdd` CLI exists for agents, developers, and CI. Agents run the commands, then reflect the result back into wiki metadata and screenshots.

For `page` nodes, screenshots are required once the node is reflected in code or verified. A reflected screen without a screenshot is not ready, because the wiki reader cannot confirm what actually shipped.

For user changes, the product wiki should be read-mostly until work is picked up. New requests enter through GitHub Issues, not through product wiki nodes. An issue names the target product wiki pages and proposed patch; after an agent applies the patch, updates code, verifies, and refreshes screenshots, the product wiki becomes the final SSOT again through the PR.

A request like "change this wiki page like this" should create or update a GitHub issue first, not edit the product page directly. The issue can include the exact intended product wiki wording or section replacement, then the implementation branch moves that content into the product wiki and continues through coding, verification, screenshots, and PR review.

## GitHub Work Layer

GitHub Issues and PRs are the active work layer:

- Issue: intent, target product wiki nodes, proposed wiki patch, likely code targets, verification plan, dependencies.
- Branch/worktree: isolated execution of one picked-up issue or one independent child issue.
- PR: the durable change set containing product wiki patch, code patch, tests, screenshots, and evidence.
- Merge: the point where product wiki truth changes for everyone.

Useful `gh` CLI flow:

```bash
gh issue create --template wdd-change.md --title "[WDD] <change>"
gh issue list --label wdd --state open
gh issue view <number>
gh issue edit <number> --add-assignee @me
git switch -c codex/issue-<number>-<slug>
gh pr create --fill
```

## Node Types

- `entity`: persistence contract, columns, lifecycle, constraints.
- `model`: domain validation and typed shape.
- `action`: mutation/write API contract.
- `page`: route, visible states, user actions, screenshots.
- `flow`: cross-page handoff contract.
- `policy`: cross-cutting business rule.
- `qa`: executable scenarios and edge cases.
- `design`: product UI tokens and state expression.
- `term`: glossary and non-generated knowledge.

## Frontmatter Contract

```yaml
id: pages/example-page
type: page
title: Example Page
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - models/example-model
implemented_by:
  - <appRoot>/src/app/examples/[id]/page.tsx
verified_by:
  - <appRoot>/tests/e2e/example-page.spec.ts
artifacts:
  - <appRoot>/src/app/examples/[id]/_components/example-page-screen.tsx
screenshots:
  - path: <wikiRoot>/assets/screenshots/pages/example-page.png
    alt: Example page after QA passes
    route: /examples/example-id
verify:
  - npm run e2e -- example-page
```

Use YAML block lists for paths containing brackets, such as `bookings/[id]/page.tsx`. Inline YAML arrays can misread `[id]`.

## Agent/CI Commands

```bash
npm run dev -w pilot-booking-app        # product app on http://127.0.0.1:3001
npm run dev -w wdd-wiki-browser         # static wiki browser on http://127.0.0.1:3002
npm run wdd -- index pilot/wiki
npm run wdd -- impact pilot/wiki actions/create-booking
npm run wdd -- session pilot/wiki actions/create-booking
npm run wdd -- status pilot/wiki
npm run wdd -- drift pilot/wiki .
npm run wdd -- screenshots pilot/wiki
npm run wdd -- ready
```

These commands are not the product-user interface. They are the harness controls that agents and CI use to keep the wiki, code, and verification evidence aligned.

`npm run build -w wdd-wiki-browser` creates a static export in `apps/wiki-browser/out`. Set `WIKI_BASE_PATH=/your-repo-name` when deploying to a GitHub Pages project site that is served from a subpath.

`wdd ready` is the project-neutral static gate. It checks workflow status, referenced files, screenshot contracts, and verify-command declarations.

`npm run ready` is this repository's full dogfood gate. It runs harness tests, product app tests, static wiki browser tests, builds, product QA, screenshot capture, wiki browser E2E, and then `wdd ready`.

## Starting Another App

1. Copy the templates under `templates/` into your project's wiki.
2. Create `wdd.config.json` with your `wikiRoot`, `repoRoot`, and `appRoot`.
3. Keep project code paths in wiki frontmatter using real paths for that project.
4. Add screenshots to reflected page nodes after QA passes; reflected page nodes without screenshots fail the ready gate.
5. Route user changes through GitHub Issues and PRs unless the project intentionally allows direct product wiki edits.
6. Teach agents through `AGENTS.md` to obey the issue pickup -> product wiki patch -> coding -> verification -> PR cadence.

The harness can guide and verify the workflow, but the agent still writes product code by reading the wiki.
