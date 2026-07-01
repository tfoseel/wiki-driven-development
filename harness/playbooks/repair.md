# Repair Playbook

## When to use

Use this when the product, wiki, or evidence is inconsistent but the intended product truth is already known.

## Bug fix

Use when shipped behavior does not match product wiki truth.

1. Create or accept a focused issue naming the broken wiki node.
2. Keep product wiki truth intact unless the desired behavior itself changes.
3. Trace impact from the wiki node.
4. Fix referenced code and add regression coverage.
5. Run declared verification and `wdd ready`.

## Evidence refresh

Use when code and wiki truth are correct but screenshots, flow trees, or QA evidence are stale.

1. Do not change product meaning.
2. Refresh evidence next to the owning wiki node.
3. Update metadata only if route or evidence paths were wrong.
4. Run screenshot, flow-tree, and ready checks.

## Hotfix

Use when production risk requires a compressed path.

1. Record the incident and target wiki nodes in an issue.
2. Make the smallest safe fix.
3. Reconcile wiki truth, tests, and evidence immediately after the emergency path.
4. Create follow-up issues for any skipped checks.

## Done

- The mismatch is resolved without hiding product changes as repairs.
- Evidence and status are honest.
- `wdd ready` passes or the remaining risk is linked as follow-up work.
