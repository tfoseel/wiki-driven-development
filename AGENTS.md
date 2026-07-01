# WDD Agent Entry

This repository uses Wiki-Driven Development. Keep this file short; detailed workflow lives in `harness/AGENTS.md`.

1. Read `harness/AGENTS.md` before changing product, wiki, or harness behavior.
2. Start product changes from an accepted GitHub Issue unless the user explicitly asks for a local spike.
3. Choose the relevant playbook under `harness/playbooks/`, then read the needed contracts under `harness/contracts/`.
4. Update wiki truth before code; create missing wiki nodes from `harness/templates/`.
5. Run impact/session before coding and edit only wiki-referenced files.
6. Verify declared tests, QA, screenshots, and flow-tree evidence.
7. Use `wdd mark` and `wdd ready` before claiming completion or opening a PR.
