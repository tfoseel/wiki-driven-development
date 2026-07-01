# Verification And QA Phase

## When to use

Use this after code reflects the wiki and before marking nodes verified.

## Agent prompt

Prove the wiki truth through tests and visible evidence. Refresh screenshots and generated flow-tree captures so readers can inspect what shipped.

## Steps

1. Run each changed node's declared `verify` commands.
2. Run E2E or QA commands for affected flows.
3. Refresh route-backed screen screenshots.
4. Refresh generated flow-tree captures after screenshots.
5. Run `wdd status`, `wdd drift`, and `wdd ready`.
6. If verification fails, run `wdd mark <wikiRoot> <nodeId> --phase verification --code reflected --verification failed --note "<failure summary>"`.
7. If verification passes, leave final verified marking to the ready/PR phase.

## Done

- Tests pass for the changed behavior.
- Screen nodes show current screenshots.
- Flow nodes show current generated screen-tree captures.
- Ready checks have no issues.
