# GitHub Issue Work Layer Plan

**Goal:** Keep the product wiki as the product SSOT while GitHub Issues and PRs carry active work state.

**Decision:** Do not model active work as product wiki nodes. A request starts as a GitHub issue, is implemented on a branch/worktree, and lands through a PR that updates product wiki pages, code, verification evidence, and screenshots together.

**Minimum semantics:**
- Product wiki nodes describe current product behavior on the branch where they live.
- GitHub issues describe requested/proposed changes before product wiki truth changes.
- The smallest semantic unit of work is an issue section naming target product wiki nodes and proposed patches.
- GitHub PRs are the durable change set and review surface.
- Parallel work uses independent issues, branches, or worktrees. Dependency order is represented with issue links/checklists and PR ordering.
- The wiki browser stays product-only; it is not a task board.

**Agent pickup cadence:**
1. Read the issue with `gh issue view <number>`.
2. Assign or mark pickup with `gh issue edit <number> --add-assignee @me`.
3. Create an isolated branch or worktree.
4. Apply the product wiki patch first.
5. Trace impact from the modified product wiki nodes.
6. Update referenced code and tests.
7. Run verification, refresh screenshots for reflected page nodes, and update `wdd_status`.
8. Open a PR that links the issue and lists wiki/code/verification evidence.

**Verification:**
- Parser tests reject work tracking as product wiki node types.
- Wiki browser tests verify there is no Work space and no `work-items/*` product node.
- GitHub issue and PR templates carry the reusable work-layer contract.
