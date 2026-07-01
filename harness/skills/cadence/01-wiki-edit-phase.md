# Wiki Edit Phase

## When to use

Use this when applying an accepted change to product wiki truth.

## Agent prompt

Edit the owning wiki node first, then update impacted wiki nodes so the wiki remains readable and internally consistent before code changes.

## Steps

1. Read the target node and its wiki-area skill.
2. Set changed nodes to an honest in-progress `wdd_status`.
3. Update product meaning, constraints, examples, and visible prose.
4. Update hidden WDD metadata: dependencies, implementation files, verification files, artifacts, screenshots, and verify commands.
5. Update impacted nodes that become stale because of the change.
6. Run `wdd mark <wikiRoot> <nodeId> --phase coding --code pending --verification pending --with-impact` when the wiki edit means code must change.

## Done

- The wiki explains the desired product behavior without relying on code.
- Impacted nodes are no longer contradictory.
- If code must change next, changed nodes are in `phase: coding`.
