# Wiki Consistency

## When to use

Use this when a wiki node, metadata field, screenshot, flow tree, or status line may be stale.

## Agent prompt

Repair wiki consistency without changing product behavior unless the user requested a product change.

## Steps

1. Check hidden WDD metadata parses correctly.
2. Check the visible `## 상태` line matches `wdd_status`.
3. Check dependencies point to existing wiki node ids.
4. Check `implemented_by`, `verified_by`, `artifacts`, and `screenshots` point to existing files.
5. Check screen screenshots and flow-tree captures are embedded where required.
6. Use `wdd mark` to repair status drift instead of inventing status prose by hand.
7. Run `wdd ready`.

## Done

- The wiki is readable in GitHub Markdown.
- The harness can index, trace, and verify the wiki without special project knowledge.
