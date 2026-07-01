# Product Change

## Meaning

A normal product change updates what the product should do: a new feature, changed behavior, new screen, action, model, policy, or flow.

## Cadence

- Work shaping: full. The issue should name target wiki nodes, new wiki nodes, acceptance criteria, QA, and evidence needs.
- Wiki truth: full. Create missing nodes from templates before code exists.
- Impact: full.
- Coding: full, limited to files named by impacted wiki nodes.
- Verification: full, including tests, E2E, screenshots, and flow-tree captures when applicable.
- Ready/PR: full. Use `Closes #<issue>` only when acceptance criteria are complete.

## Rule

Do not start code before the owning wiki truth exists.
