# Ready And PR Phase

## When to use

Use this after verification succeeds and before handing work to review or merge.

## Agent prompt

Turn the verified change set into a reviewable PR that contains wiki truth, code, tests, and evidence.

## Steps

1. Run `wdd mark <wikiRoot> <nodeId> --phase verified --code reflected --verification passed --clear-note --with-impact` for implemented product changes.
2. For documentation-only nodes, use `--code not_required --verification not_required` instead of reflected/passed.
3. Run the full project ready command.
4. Review the diff for unrelated files, generated noise, or stale artifacts.
5. Commit the branch with a message that names the wiki-backed change.
6. Push and open or update the PR.

## Done

- The PR includes product wiki changes, code changes, tests, screenshots, flow-tree captures, and ready evidence.
- The branch contains no temporary debugging artifacts.
