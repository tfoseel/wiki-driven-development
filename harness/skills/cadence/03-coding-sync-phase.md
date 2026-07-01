# Coding Sync Phase

## When to use

Use this when the wiki describes a behavior that code does not yet reflect.

## Agent prompt

Implement only what the impacted wiki nodes require. Keep wiki status synchronized with code progress.

## Steps

1. Re-read the changed wiki node before editing code.
2. Edit referenced code files only.
3. Add or update tests named in `verified_by` or `verify`.
4. If implementation reveals a better contract, update the wiki first and then continue coding.
5. When code reflects the wiki, run `wdd mark <wikiRoot> <nodeId> --phase verification --code reflected --verification pending --with-impact`.
6. Run `wdd status <wikiRoot> <nodeId>` and fix any inconsistent phase state before QA.

## Done

- Code implements the wiki contract.
- Tests exist or are updated for the changed behavior.
- Wiki metadata still points at the files that actually changed.
