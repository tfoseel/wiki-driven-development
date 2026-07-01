# WDD Harness Agent Router

This folder is the executable playbook for Wiki-Driven Development. Before changing product truth, read the cadence skill for the current phase and the wiki-area skill for every node type you touch.

## Routing Rule

Use cadence skills in order. Do not skip forward because a code change looks obvious.

1. Request or issue intake: `skills/cadence/00-github-issue-intake.md`
2. Product wiki edit: `skills/cadence/01-wiki-edit-phase.md`
3. Impact tracing: `skills/cadence/02-impact-phase.md`
4. Code and wiki status sync: `skills/cadence/03-coding-sync-phase.md`
5. Verification, QA, screenshots, flow trees: `skills/cadence/04-verification-qa-phase.md`
6. Ready gate and PR handoff: `skills/cadence/05-ready-pr-phase.md`
7. Wiki consistency repair: `skills/cadence/06-wiki-consistency.md`

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
- Product truth changes start from a GitHub Issue unless the user explicitly asks for a local spike.
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
