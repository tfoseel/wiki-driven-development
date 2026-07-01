# WDD Harness

The harness is the reusable operating system for Wiki-Driven Development. It is not just scripts: it contains the agent prompts, wiki node contracts, templates, and static gates that keep product wiki, code, tests, screenshots, and flow-tree evidence aligned.

## Folder Shape

```txt
harness/
  AGENTS.md                 agent router
  skills/
    work-shaping/           request-to-PRD-issue prompts
    cadence/                phase-by-phase execution prompts
    wiki-areas/             node-type authoring prompts
  templates/                starter wiki nodes and downstream AGENTS.md
  src/                      thin tools used by the Markdown skills
  tests/                    reusable harness behavior checks
```

## How Agents Use This

1. Read `harness/AGENTS.md`.
2. Shape a user request into a PRD-like GitHub Issue when no accepted issue exists.
3. Select the cadence skill for the current phase after the issue is accepted.
4. Select the wiki-area skill for every node type being edited or created.
5. Perform wiki changes first, then code, then verification.
6. Run the harness gates and reflect evidence back into the wiki.

The Markdown skills are the readable workflow. The TypeScript in `src/` is only a toolbelt for those skills:

- work-shaping skills turn user requests into accepted PRD-shaped issues.
- `impact` and `session` find affected nodes and files.
- `mark` updates hidden `wdd_status` plus the visible `## 상태` summary after a phase finishes.
- `status`, `drift`, and `ready` check that wiki metadata, code references, screenshots, and flow trees still agree.
- `screenshots` and `flow-trees` expose the evidence targets that QA automation refreshes.

## Core Idea

The product wiki is the SSOT. A user can read Markdown and understand product logic, flows, QA coverage, and verification evidence. The harness gives agents a repeatable way to change that truth without leaving code, tests, or screenshots behind.

Generated artifacts are allowed, but they are derived:

- screen screenshots from `screenshots.route`
- flow-tree captures from flow Mermaid source and screen screenshots
- code changes from wiki ownership metadata
- PRs from a verified wiki/code/evidence change set
