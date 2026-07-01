# Change Playbook

## When to use

Use this for ordinary WDD work: product changes, small wiki maintenance, and planned implementation work that starts from an accepted GitHub Issue.

## Flow

1. Shape the request into a PRD-like GitHub Issue if one does not already exist.
2. Name the owning wiki nodes and any new nodes that must be created from `harness/templates/`.
3. Edit product wiki truth first. If behavior changes, update meaning, constraints, examples, dependencies, QA, screenshots targets, and verify commands before code.
4. Trace impact with `wdd impact` and `wdd session`. If code ownership is missing, update wiki metadata before coding.
5. Edit only code, tests, and artifacts referenced by impacted wiki nodes.
6. Run declared tests and QA.
7. Refresh route-backed screen screenshots and flow-tree captures when affected.
8. Run `wdd ready`.
9. Mark verified nodes with `wdd mark`.
10. Open or update the PR.

## PR rule

Use `Closes #<issue>` only when the PR fully satisfies the accepted issue. Use `Refs #<issue>` when the PR is related but incomplete.

## Light path

For wiki-only wording or navigation maintenance, keep product behavior unchanged, set code to `not_required` when appropriate, and still run `wdd ready`.

## Done

- Product wiki truth is updated before code.
- Code and tests reflect the impacted wiki nodes.
- Evidence is refreshed where readers need it.
- `wdd ready` passes.
