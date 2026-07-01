# Project Agents

For every product change, read and follow `harness/AGENTS.md` first.

Choose one playbook:

- `harness/playbooks/change.md` for normal product and wiki work.
- `harness/playbooks/legacy-migration.md` for existing code-SSOT migration.
- `harness/playbooks/repair.md` for bugs, stale evidence, and hotfixes.

Read the relevant contracts before editing:

- `harness/contracts/wiki-node.md`
- `harness/contracts/legacy-map.md`
- `harness/contracts/evidence.md`
- `harness/contracts/status.md`

Do not edit product code before updating the owning `wiki/` pages and checking impact.

During blind legacy implementation, use only the frozen wiki nodes, selected evidence, QA, and event/API specs. Do not inspect legacy code for that slice.

Legacy observation wiki nodes may use `legacy.status`, but legacy source lists stay in `legacy-map.json` and the GitHub Issue.

Record product assets in wiki `assets` metadata. Use `screenshots` and `mockups` only for wiki evidence, not for product asset provenance.

After each phase, update node status with `npm run wdd -- mark ...` so hidden WDD metadata and the visible `## 상태` line stay synchronized.
