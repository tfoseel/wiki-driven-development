# WDD Harness Agent Router

This folder is the executable playbook for Wiki-Driven Development. Shape user requests into PRD-like GitHub Issues first, then run cadence only after an issue is accepted.

## Routing Rule

Use work-shaping skills before product truth changes:

1. Clarify the request: `skills/work-shaping/00-grill-request.md`
2. Write the PRD-shaped issue: `skills/work-shaping/01-write-prd-issue.md`
3. Split large work: `skills/work-shaping/02-slice-work.md`

Use cadence skills in order after an accepted GitHub Issue exists. Do not skip forward because a code change looks obvious.

1. Apply product wiki truth: `skills/cadence/01-wiki-edit-phase.md`
2. Impact tracing: `skills/cadence/02-impact-phase.md`
3. Code and wiki status sync: `skills/cadence/03-coding-sync-phase.md`
4. Verification, QA, screenshots, flow trees: `skills/cadence/04-verification-qa-phase.md`
5. Ready gate and PR handoff: `skills/cadence/05-ready-pr-phase.md`
6. Wiki consistency repair: `skills/cadence/06-wiki-consistency.md`

## Wiki Area Skills

Pair the cadence skill with the node type you are editing:

- Entity nodes: `skills/wiki-areas/entity.md`
- Model nodes: `skills/wiki-areas/model.md`
- Action nodes: `skills/wiki-areas/action.md`
- Screen nodes: `skills/wiki-areas/screen.md`
- Flow nodes: `skills/wiki-areas/flow.md`
- QA nodes: `skills/wiki-areas/qa.md`
- Policy nodes: `skills/wiki-areas/policy.md`
- Design nodes: `skills/wiki-areas/design.md`
- Root, term, and map nodes: `skills/wiki-areas/term-root.md`

## Hard Rules

- Product wiki Markdown is the SSOT; code, tests, screenshots, flow-tree captures, and PRs are derived evidence.
- Cadence starts from an accepted GitHub Issue unless the user explicitly asks for a local spike.
- The issue is the active PRD/work object; product wiki nodes hold merged truth, not loose task intent.
- Edit the owning wiki node before code. If code ownership is missing, add ownership metadata before editing code.
- Keep `wdd_status` honest while work is in progress. Do not leave a node verified when code or verification is pending.
- Do not invent custom status prose. The `## 상태` line must match hidden WDD metadata.
- Use `wdd mark` after a phase finishes so hidden metadata and the visible status summary move together.
- User-facing product readers should not need `wdd` commands; agents and CI run the harness.

## Minimal Command Surface

```bash
npm run wdd -- impact wiki <nodeId>
npm run wdd -- session wiki <nodeId>
npm run wdd -- mark wiki <nodeId> --phase coding --code pending --verification pending --with-impact
npm run wdd -- status wiki
npm run wdd -- drift wiki .
npm run wdd -- screenshots wiki
npm run wdd -- flow-trees wiki .
npm run wdd -- ready
```
