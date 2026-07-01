# WDD Harness Agent Router

This folder is the executable playbook for Wiki-Driven Development. Keep the model simple:

- `playbooks/`: how to run work.
- `contracts/`: what must stay true.
- `templates/`: files to copy when creating new wiki nodes.
- `src/`: small tools that check or update the wiki.

## Start Here

1. If there is no accepted GitHub Issue, shape one before changing product truth.
2. Choose one playbook:
   - Product change or wiki maintenance: `playbooks/change.md`
   - Legacy code-SSOT migration: `playbooks/legacy-migration.md`
   - Bug, stale evidence, or hotfix repair: `playbooks/repair.md`
3. Read the relevant contracts:
   - Wiki node ownership: `contracts/wiki-node.md`
   - Legacy provenance: `contracts/legacy-map.md`
   - Screenshots, flow trees, assets: `contracts/evidence.md`
   - Workflow status: `contracts/status.md`
4. Update product wiki before code.
5. Run impact/session before editing code.
6. Verify tests, QA, screenshots, flow trees, and `wdd ready`.

## Hard Rules

- Product wiki Markdown is the SSOT; code, tests, screenshots, flow-tree captures, and PRs are derived evidence.
- The issue is the active PRD/work object; product wiki nodes hold merged truth, not loose task intent.
- Edit the owning wiki node before code. If code ownership is missing, add ownership metadata before editing code.
- `implemented_by` means wiki-derived implementation exists.
- Legacy source lists and observation provenance belong in `legacy-map.json` or the GitHub Issue, not product wiki metadata.
- API behavior belongs in 액션 (`action`) nodes; DB and persistence behavior belongs in DB테이블 (`entity`) nodes; payload shape belongs in 앱객체 (`model`) nodes.
- Unknown behavior is a gap, not a passed check.
- Keep `wdd_status` honest while work is in progress.
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
npm run wdd -- legacy status
npm run wdd -- legacy mark <filePath> --status observed --evidence <wiki-or-issue-evidence>
npm run wdd -- ready
```
