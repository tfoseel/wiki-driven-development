# Ready And PR Phase

## When to use

Use this after verification succeeds and before handing work to review or merge.

## Agent prompt

Turn the verified change set into a reviewable PR that contains wiki truth, code, tests, and evidence.

## Steps

1. Run `wdd mark <wikiRoot> <nodeId> --phase verified --code reflected --verification passed --clear-note --with-impact` for implemented product changes.
2. For documentation-only nodes, use `--code not_required --verification not_required` instead of reflected/passed.
3. Run the full project ready command.
4. Check the accepted issue acceptance criteria against wiki, code, tests, screenshots, and flow-tree evidence.
5. Review the diff for unrelated files, generated noise, or stale artifacts.
6. Commit the branch with a message that names the wiki-backed change.
7. Push and open or update the PR.
8. Put `Closes #<issue>` in the PR description only when the PR fully satisfies that issue.
9. Put `Refs #<issue>` when the PR is related but does not resolve the whole issue.
10. For parent/child work, close only the child issue implemented by this PR and update the parent checklist or links.

## Done

- The PR includes product wiki changes, code changes, tests, screenshots, flow-tree captures, and ready evidence.
- The PR links to the accepted issue and resolves it only when acceptance criteria are complete.
- The branch contains no temporary debugging artifacts.
