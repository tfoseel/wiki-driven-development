# Slice Work

## When to use

Use this when a PRD-shaped issue is too large for one safe cadence pass.

## Agent prompt

Split the issue into dependency-aware child issues or an ordered checklist. Each child issue should own a small wiki truth change plus its code and verification evidence.

## Steps

1. Identify independent wiki nodes, new nodes, flows, and QA surfaces.
2. Build a dependency graph from wiki truth, not from guessed implementation order.
3. Group work into slices that can each finish wiki, code, verification, screenshots, and PR.
4. Mark which slices can run in parallel and which must wait.
5. Link child issues back to the parent issue.

## Done

- Each slice has target wiki nodes, acceptance criteria, and verification.
- Parallel work is explicit.
- Cadence can pick up one accepted issue without hidden dependencies.
