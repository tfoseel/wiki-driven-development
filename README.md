# Wiki-Driven Development

Wiki-Driven Development (WDD) treats the product wiki as the SSOT. The Next.js app is not compiled deterministically from the wiki; an agent reads the wiki, updates the wiki first, traces impact, edits referenced code, and verifies the result.

## Repository Shape

```txt
wiki/        product SSOT Markdown in downstream projects
harness/     WDD cadence skills, node skills, templates, lint, impact, screenshot, and ready checks
AGENTS.md    agent entry point that forces the wiki-first cadence
```

This repository currently dogfoods the harness with the mini booking pilot, but the durable target shape for downstream Next.js projects is "default Next.js app plus `wiki/`, `harness/`, and `AGENTS.md`." The wiki is read as Markdown in GitHub, local editors, Obsidian, Codex, Claude, or any other Markdown-aware tool.

## Core Cadence

Every product change starts with work shaping unless an accepted GitHub Issue already exists. Work shaping turns the user's request into a PRD-shaped issue with a declared work type, target wiki nodes, new wiki nodes, acceptance criteria, QA expectations, and evidence needs.

Work types keep small or repair work lightweight without losing traceability:

- `normal/product-change`: new or changed product behavior.
- `normal/wiki-maintenance`: wording, navigation, or terminology without product meaning changes.
- `repair/bug-fix`: shipped behavior does not match wiki truth.
- `repair/evidence-refresh`: screenshots, flow trees, or QA evidence are stale.
- `repair/hotfix`: urgent fix with mandatory post-fix WDD reconciliation.

Cadence starts only after that issue is accepted:

1. **Wiki phase:** update the wiki node that owns the behavior, plus impacted wiki nodes.
2. **Impact phase:** run `wdd impact` or read dependencies to find affected screens and files.
3. **Coding phase:** edit only the referenced code or update the wiki if ownership metadata was wrong.
4. **Verification phase:** run declared tests, E2E, QA screenshots, `wdd status`, and `wdd drift`.
5. **PR phase:** use `wdd mark` to mark impacted nodes as `phase: verified`, `code: reflected`, `verification: passed`, run `wdd ready`, and open a PR that links the issue.

If work stops mid-cadence, leave `wdd_status` in the current phase. A reader should be able to see whether the wiki is implemented and verified.
Agents and CI should update that status with `wdd mark` so hidden metadata and the human `## 상태` line stay synchronized.

## User Experience

Product users should not need to learn `wdd` commands. Their interface is the Markdown wiki itself:

- `wiki/*.md` is the SSOT and GitHub Markdown is the primary reading surface;
- HTML renderers are optional derived artifacts, not the source of truth;
- `wdd_status` in hidden WDD metadata is the machine-readable status truth;
- the `## 상태` line is the human-readable status summary and must match `wdd_status`;
- impact, implementation metadata, verification files, and commands live in collapsible Markdown `<details>` sections;
- evidence remains in wiki metadata and screen screenshots.

The harness exists for agents, developers, and CI. Agents run the commands, then reflect the result back into wiki metadata and screenshots.

For screen-owning nodes, screenshots are required once the node is reflected in code or verified. A reflected screen without a screenshot is not ready, because the wiki reader cannot confirm what actually shipped.

For user changes, the product wiki should be read-mostly until work is picked up. New requests enter through GitHub Issues, not through product wiki nodes. An issue names the target product wiki nodes and proposed patch; after an agent applies the patch, updates code, verifies, and refreshes screenshots, the product wiki becomes the final SSOT again through the PR.

A request like "change this wiki node like this" should create or update a GitHub issue first, not edit the product node directly. The issue can include the exact intended product wiki wording, new node list, or section replacement, then the implementation branch moves that content into the product wiki and continues through coding, verification, screenshots, and PR review.

## GitHub Work Layer

GitHub Issues and PRs are the active work layer:

- Issue: intent, target product wiki nodes, proposed wiki patch, likely code targets, verification plan, dependencies.
- Branch/worktree: isolated execution of one picked-up issue or one independent child issue.
- PR: the durable change set containing product wiki patch, code patch, tests, screenshots, and evidence.
- Merge: the point where product wiki truth changes for everyone.

PR descriptions should use `Closes #<issue>` only when the issue acceptance criteria are fully satisfied. Use `Refs #<issue>` for partial or related work. When a parent issue is split into child issues, each PR closes its child issue and updates the parent checklist or links.

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
- `screen`: route, visible states, user actions, screenshots.
- `flow`: generated screen tree capture, Mermaid source, and cross-screen handoff contract.
- `policy`: cross-cutting business rule.
- `qa`: executable scenarios and edge cases.
- `design`: product UI tokens and state expression.
- `term`: glossary and non-generated knowledge.

## Hidden WDD Metadata Contract

```md
<!-- wdd
id: screens/example-screen
type: screen
title: Example Screen
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - models/example-model
implemented_by:
  - <appRoot>/src/app/examples/[id]/page.tsx
verified_by:
  - <appRoot>/tests/e2e/example-screen.spec.ts
artifacts:
  - <appRoot>/src/app/examples/[id]/_components/example-screen.tsx
screenshots:
  - path: <wikiRoot>/자료/스크린샷/화면/example.png
    alt: Example screen after QA passes
    route: /examples/example-id
verify:
  - npm run e2e -- example-screen
-->
```

The metadata is ordinary YAML wrapped in `<!-- wdd ... -->` so GitHub Markdown readers start at the title instead of showing a raw metadata table. Use YAML block lists for paths containing brackets, such as `bookings/[id]/page.tsx`. Inline YAML arrays can misread `[id]`.

Every wiki Markdown file also exposes a canonical human status line:

```md
## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기
```

That line is not free text. The harness derives the exact allowed line from `wdd_status` and `wdd ready` fails when the Markdown line drifts.

Implementation metadata should stay readable but out of the main narrative:

```md
<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `screens/example-screen`
- 의존: [[models/example-model]]
- 구현: `<appRoot>/src/app/examples/[id]/page.tsx`
- 검증 파일: `<appRoot>/tests/e2e/example-screen.spec.ts`
- 검증 명령: `npm run e2e -- example-screen`

</details>
```

Screen-owning nodes must also show shipped visual evidence inline in the body:

```md
## 화면 증거
![Example screen after QA passes](../자료/스크린샷/화면/example.png)
```

Flow nodes should show a generated screen tree capture first, then keep the Mermaid source in a collapsible section. During QA, agents and CI refresh screen screenshots first and then regenerate flow tree captures from that Mermaid source plus the referenced screen screenshots. `wdd ready` fails when a verified flow is missing the generated capture, when that capture file is missing, or when the Mermaid source does not reference dependent screen screenshots:

```md
## 화면 트리

![Create flow screen tree](../자료/흐름/create-flow-screen-tree.png)

<details>
<summary>Mermaid source</summary>

```mermaid
flowchart TD
  start["Start<br/><img src='../자료/스크린샷/화면/start.png' width='160' />"]
  next["Next<br/><img src='../자료/스크린샷/화면/next.png' width='160' />"]

  start -->|Primary choice| next
```

</details>
```

## Agent/CI Commands

```bash
npm run dev        # product app on http://127.0.0.1:3001
npm run wdd -- index wiki
npm run wdd -- impact wiki actions/create-booking
npm run wdd -- session wiki actions/create-booking
npm run wdd -- mark wiki actions/create-booking --phase verification --code reflected --verification pending --with-impact
npm run wdd -- status wiki
npm run wdd -- drift wiki .
npm run wdd -- screenshots wiki
npm run wdd -- flow-trees wiki . --json
npm run wdd -- ready
```

These commands are not the product-user interface. They are the harness controls that agents and CI use to keep the wiki, code, and verification evidence aligned.

`wdd ready` is the project-neutral static gate. It checks workflow status, canonical Markdown status summaries, referenced files, screenshot contracts, and verify-command declarations.

`npm run ready` is this repository's full dogfood gate. It runs harness tests, product app tests, builds, product QA, screen screenshot capture, flow tree capture, and then `wdd ready`.

## Starting Another Next.js App

Use the pilot as a dogfood reference, not as a required shape. For an existing Next.js boilerplate, add WDD as a project layer instead of reshaping the whole app.

```txt
app/ or src/app/         existing Next.js App Router product app
public/                  existing Next.js assets, if present
wiki/                    product SSOT Markdown
wiki/QA/                 executable coverage and edge-case proof
harness/                 WDD rules, scripts, templates, and evidence conventions
.github/ISSUE_TEMPLATE/  WDD change intake
.github/PULL_REQUEST_TEMPLATE.md
AGENTS.md                thin pointer that forces agents to follow harness/ first
```

Minimum setup:

1. Start from a normal Next.js project. Keep its `app/` or `src/app/` choice.
2. Create `wiki/` and copy `harness/templates/*.md` into it. Rename each template file to real product nodes.
3. Keep the WDD tool package, cadence skills, wiki-area skills, runbooks, and templates in `harness/`.
4. Copy `harness/templates/AGENTS.md` to the repo root and keep `harness/AGENTS.md` inside the harness folder.
5. Add harness configuration under `harness/` or wire it through package scripts, setting `wikiRoot`, `repoRoot`, and `appRoot`.
6. Put real repo-relative paths in hidden WDD metadata. Use block YAML lists for paths with brackets such as `app/src/app/items/[id]/page.tsx`.
7. Keep `## 상태` lines generated from hidden WDD metadata. Do not invent custom status prose.
8. For screen-owning nodes, keep screenshot paths repo-relative in metadata, for example `wiki/자료/스크린샷/화면/example.png`, set `screenshots.route` to a route the product app can render during QA, and embed the screenshot as a Markdown image in the body.
9. For flow nodes, embed a generated capture such as `wiki/자료/흐름/example-flow-screen-tree.png`, keep Mermaid source below it, and reference dependent screen screenshots through `<img src='...'>` inside that Mermaid source.
10. Route user changes through GitHub Issues and PRs. Issues hold work-in-progress intent; merged product wiki nodes hold truth.
11. Keep historical plans out of the repo unless they are active issues or PR notes. Durable decisions belong in `wiki/`, `harness/`, templates, tests, or README.

Recommended Next.js scripts:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "test": "vitest run",
    "e2e": "playwright test",
    "wiki:screenshots": "node scripts/capture-wiki-screenshots.mjs",
    "wiki:flow-trees": "node scripts/capture-wiki-flow-trees.mjs",
    "qa": "npm run e2e && npm run wiki:screenshots && npm run wiki:flow-trees"
  }
}
```

The harness can guide and verify the workflow, but the agent still writes product code by reading the wiki.
