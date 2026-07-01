# Wiki Maintenance

## Meaning

Wiki maintenance improves wording, navigation, terminology, examples, or structure without changing product meaning.

## Cadence

- Work shaping: light. The issue should state that product behavior is unchanged.
- Wiki truth: full for the edited Markdown, but no product behavior patch.
- Impact: light. Check affected links and dependencies.
- Coding: skip unless metadata references must be corrected.
- Verification: light. Run wiki consistency and ready checks.
- Ready/PR: full enough to show `code: not_required` and `verification: not_required` when no implementation surface exists.

## Rule

If behavior, policy, fields, screen states, or QA expectations change, use `normal/product-change.md` instead.
