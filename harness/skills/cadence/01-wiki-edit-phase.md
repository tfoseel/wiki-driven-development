# Apply Wiki Truth Phase

## When to use

Use this when applying an accepted GitHub Issue to product wiki truth.

## Agent prompt

Create or edit the owning wiki node first, then update impacted wiki nodes so the wiki remains readable and internally consistent before code changes.

## Steps

1. Read the accepted issue, target wiki node ids, and proposed patch.
2. Read each target node's wiki-area skill.
3. If a target node does not exist, copy the matching `harness/templates/<type>.md` file into `wiki/`, rename it for the product concept, and fill `id`, `type`, `title`, `summary`, dependencies, implementation files, verification files, screenshots, and verify commands.
4. Set changed nodes to an honest in-progress `wdd_status`.
5. Update product meaning, constraints, examples, and visible prose.
6. Update hidden WDD metadata: dependencies, implementation files, verification files, artifacts, screenshots, and verify commands.
7. Update impacted nodes that become stale because of the change.
8. Run `wdd mark <wikiRoot> <nodeId> --phase coding --code pending --verification pending --with-impact` when the wiki edit means code must change.

## Done

- The wiki explains the desired product behavior without relying on code.
- New product concepts have real wiki nodes created from templates before code exists.
- Impacted nodes are no longer contradictory.
- If code must change next, changed nodes are in `phase: coding`.
