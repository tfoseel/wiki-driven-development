# WDD Harness

The harness is the reusable operating system for Wiki-Driven Development. It contains playbooks, contracts, templates, and small static tools that keep product wiki, code, tests, screenshots, and flow-tree evidence aligned.

## Folder Shape

```txt
harness/
  AGENTS.md                 agent router
  playbooks/                how to run work
  contracts/                rules that must stay true
  templates/                starter wiki nodes and downstream AGENTS.md
  src/                      thin tools used by agents and CI
  tests/                    reusable harness behavior checks
```

## How Agents Use This

1. Read `harness/AGENTS.md`.
2. Start from an accepted GitHub Issue, or shape one before changing product truth.
3. Choose one playbook:
   - `playbooks/change.md`
   - `playbooks/legacy-migration.md`
   - `playbooks/repair.md`
4. Read the contracts that govern the work:
   - `contracts/wiki-node.md`
   - `contracts/legacy-map.md`
   - `contracts/evidence.md`
   - `contracts/status.md`
5. Change wiki truth first, then code, then verification evidence.
6. Run the harness gates and reflect evidence back into the wiki.

The Markdown files are the readable workflow. The TypeScript in `src/` is only a small toolbelt:

- `impact` and `session` find affected nodes and files.
- `mark` updates hidden `wdd_status` plus the visible `## 상태` summary.
- `status`, `drift`, and `ready` check that wiki metadata, code references, screenshots, and flow trees agree.
- `screenshots` and `flow-trees` expose evidence targets that QA automation refreshes.
- `legacy init` and `legacy status` manage file-level migration state.

## Legacy Migration

Existing apps begin with code as the source of truth. The legacy playbook moves one slice at a time into wiki truth:

```txt
code-ssot -> observed -> specified -> spec-frozen -> blind-implemented -> parity-reviewed -> wiki-ssot -> retired
```

The extractor may inspect legacy code and the live app. The blind implementer may not inspect legacy code for that slice; they work from frozen wiki nodes, screenshots, QA scenarios, event/API specs, product asset metadata, and selected evidence. Only a slice that passes blind implementation and parity review can be marked `wiki-ssot`.

## Core Idea

The product wiki is the SSOT. A user can read Markdown and understand product logic, flows, QA coverage, and verification evidence. The harness gives agents a repeatable way to change that truth without leaving code, tests, or screenshots behind.

Generated artifacts are allowed, but they are derived:

- screen screenshots from `screenshots.route`
- flow-tree captures from flow Mermaid source and screen screenshots
- code changes from wiki ownership metadata
- PRs from a verified wiki/code/evidence change set
