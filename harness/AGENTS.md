# WDD Harness Agent Runbook

This project uses Wiki-Driven Development.

## Required Cadence

1. Start from a GitHub Issue or create one before changing product truth.
2. Edit the owning `wiki/` Markdown file first, then any impacted wiki nodes.
3. Check impact before coding.
4. Edit only code referenced by the impacted wiki nodes. If code ownership is missing, update wiki metadata first.
5. Run declared tests, E2E, screenshot capture, and the ready gate.
6. Mark wiki nodes verified only after code and verification evidence are reflected.

## Hard Rules

- Product code is derived work; `wiki/` is the SSOT.
- GitHub Markdown rendering of `wiki/*.md` is the default reading surface.
- HTML output is optional derived output, not source truth.
- Do not invent human status prose. `## 상태` must match the canonical line derived from `wdd_status`.
- Do not treat temporary plans as durable truth.
- Work-in-progress intent belongs in GitHub Issues and PRs.
- Durable decisions belong in `wiki/`, this `harness/` folder, templates, tests, or README.
- Reflected screen nodes must have route-backed screenshots.

## Useful Commands

```bash
npm run wdd -- impact wiki <nodeId>
npm run wdd -- session wiki <nodeId>
npm run wdd -- status wiki
npm run wdd -- drift wiki .
npm run wdd -- screenshots wiki
npm run wdd -- ready
```
