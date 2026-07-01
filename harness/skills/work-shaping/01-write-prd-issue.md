# Write PRD Issue

## When to use

Use this after the request is clear enough to become an executable work item.

## Agent prompt

Create or update a GitHub Issue that works like a small PRD. The issue is the active work object; product wiki truth changes only when cadence applies the accepted issue.

## Steps

1. Choose one work type:
   - `normal/product-change`
   - `normal/wiki-maintenance`
   - `repair/bug-fix`
   - `repair/evidence-refresh`
   - `repair/hotfix`
2. State the goal, user value, and non-goals.
3. Name target wiki node ids and any new wiki nodes that must be created from templates.
4. Capture proposed wiki wording, behavior, or section replacements.
5. Add acceptance criteria in product language.
6. Add QA expectations, screenshot or flow-tree evidence needs, and edge cases.
7. Name likely code targets only as a first guess.
8. Add labels and dependencies so the issue can be picked up by one agent or split later.

## Issue shape

```md
## Work Type

- type: normal/product-change
- reason: This changes product behavior.

## Target Wiki Nodes

- existing:
- new:

## Acceptance Criteria

-

## Evidence

- tests:
- screenshots:
- flow trees:
```

## Done

- A GitHub Issue names target and new wiki nodes.
- The issue declares a work type that points to `harness/skills/work-types/`.
- The issue has PRD-like acceptance criteria.
- The issue is ready to be accepted, split, or picked up by cadence.
