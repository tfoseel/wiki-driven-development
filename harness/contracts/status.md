# Status Contract

## Contract

`wdd_status` and the visible `## 상태` line must describe the same phase. Do not invent custom status prose.

## Phases

- `wiki`: product truth is being written or revised.
- `coding`: code must be changed to reflect wiki truth.
- `verification`: code exists and needs tests, QA, screenshots, or flow-tree evidence.
- `verified`: code and verification evidence match wiki truth.
- `blocked`: progress needs a concrete external input or decision.

## Code status

- `pending`: code has not reflected the wiki yet.
- `reflected`: wiki-derived code exists.
- `not_required`: the node has no implementation surface.

## Verification status

- `pending`: verification has not passed yet.
- `passed`: declared verification passed.
- `failed`: verification failed and the note should explain why.
- `not_required`: no verification surface is required.

## Agent rule

Use `wdd mark` after each phase so hidden metadata and visible Markdown stay synchronized.
