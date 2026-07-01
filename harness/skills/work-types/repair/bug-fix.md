# Bug Fix

## Meaning

A shipped behavior does not match product wiki truth, or the wiki reveals an unhandled edge case that should already work.

## Cadence

- Work shaping: light. The issue should name the broken behavior and target wiki node.
- Wiki truth: usually skip body edits. Keep truth intact and update status or notes only when needed.
- Impact: full for the target node.
- Coding: full, limited to referenced files.
- Verification: full for the affected behavior, including a regression test when possible.
- Ready/PR: full. Close the bug issue when the mismatch is fixed.

## Rule

Do not change product wiki truth to match broken behavior. If the desired truth changes, use `normal/product-change.md`.
