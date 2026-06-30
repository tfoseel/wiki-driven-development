# Generalized WDD Ready Gate Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the repository usable as a generalized Wiki-Driven Development harness, not only a booking-app pilot.

**Architecture:** Add a project config layer, a reusable `wdd ready` gate, and top-level documentation/runbooks. The pilot remains a dogfood app wired through config, while the harness stays project-neutral.

**Tech Stack:** TypeScript, Node.js, Vitest, Next.js pilot app, `@wdd/harness` CLI.

---

### Task 1: Project Config

**Files:**
- Create: `wdd.config.json`
- Create: `packages/wdd/src/config.ts`
- Test: `packages/wdd/src/config.test.ts`

**Steps:**
1. Write failing tests for loading `wdd.config.json` with `wikiRoot`, `repoRoot`, and optional `ready.verifyCommands`.
2. Implement config loading with sensible defaults for callers that pass explicit CLI paths.
3. Export config helpers from `packages/wdd/src/index.ts`.

### Task 2: Ready Gate

**Files:**
- Create: `packages/wdd/src/ready.ts`
- Test: `packages/wdd/src/ready.test.ts`
- Modify: `packages/wdd/src/cli.ts`

**Steps:**
1. Write failing tests that `ready` reports workflow attention, missing references, and missing screenshot files.
2. Implement `checkReady` and `formatReadyReport`.
3. Add CLI command `wdd ready [wikiRoot] [repoRoot]`.
4. Add root script `ready`.

### Task 3: Generalized Docs And Agent Runbook

**Files:**
- Create: `README.md`
- Create: `AGENTS.md`
- Modify: `templates/*.md`
- Modify: `pilot/wiki/ROOT.md`

**Steps:**
1. Document WDD as wiki-first agent cadence, not deterministic codegen.
2. Document node types, metadata, workflow status, screenshots, and ready gate.
3. Replace `pilot/app` hardcoded template paths with `<appRoot>` placeholders.
4. Clarify that pilot is an example app that uses the same harness.

### Task 4: Verification

**Commands:**
- `npm run test -w @wdd/harness`
- `npm run test -w pilot-booking-app`
- `npm run build -w @wdd/harness`
- `npm run build -w pilot-booking-app`
- `npm run qa -w pilot-booking-app`
- `npm run ready`

**Steps:**
1. Ensure no temporary/debug tests are left behind.
2. Keep the pilot app visible at `http://localhost:3001/`.
3. Commit the finalized harness generalization.
