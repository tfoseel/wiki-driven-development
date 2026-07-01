# Evidence Refresh

## Meaning

Product wiki truth and code are correct, but screenshots, flow-tree captures, QA evidence, or generated visual artifacts are stale.

## Cadence

- Work shaping: light. The issue should name stale evidence and affected wiki nodes.
- Wiki truth: skip product meaning edits. Update metadata only if evidence paths or routes were wrong.
- Impact: light, focused on screens, flows, and QA nodes that own the evidence.
- Coding: skip unless the evidence cannot be generated because code no longer exposes the declared route or state.
- Verification: full for evidence generation and ready checks.
- Ready/PR: full enough to show refreshed artifacts and link the issue.

## Rule

This repair type should be rare. If evidence refresh repeats, improve the normal QA, screenshot, flow-tree, or ready gate instead of normalizing manual refreshes.
