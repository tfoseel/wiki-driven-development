# GitHub Issue Intake

## When to use

Use this before changing product truth for a user request, bug report, feature, or planning change.

## Agent prompt

Turn the request into a small work item with target wiki nodes, proposed wiki patch, likely code targets, verification plan, and dependencies.

## Steps

1. Identify whether the request changes product truth.
2. Find target wiki node ids, not just filenames.
3. Capture proposed wording or behavior as an issue body.
4. Name likely code files only as a first guess.
5. Split large work into dependency-aware child issues or checklist items.

## Done

- A GitHub Issue or equivalent local work item names the target wiki nodes.
- The issue states what wiki truth should change before code is edited.
- No product wiki node has been silently changed outside the work item.
