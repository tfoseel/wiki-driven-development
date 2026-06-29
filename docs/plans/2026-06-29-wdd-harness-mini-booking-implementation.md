# WDD Harness Mini Booking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the first working WDD harness MVP and a small booking pilot that proves wiki-first agent orchestration.

**Architecture:** The harness is a TypeScript CLI in `packages/wdd` that parses markdown wiki nodes, builds a dependency graph, computes impact, emits session context, detects drift, and runs verification commands. The pilot lives in `pilot/wiki` and `pilot/app`; application code is agent-authored, while the harness manages graph, ownership, and verification metadata.

**Tech Stack:** Node.js, TypeScript, Vitest, gray-matter, markdown link parsing, Next.js pilot app, Playwright later in the pilot phase.

---

### Task 1: Root Workspace And Tooling

**Files:**
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`

**Step 1: Write the workspace package file**

Create `package.json`:

```json
{
  "name": "wiki-driven-development",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*",
    "pilot/app"
  ],
  "scripts": {
    "test": "npm run test -w @wdd/harness",
    "wdd": "npm run wdd -w @wdd/harness --",
    "build": "npm run build -w @wdd/harness"
  }
}
```

**Step 2: Add shared TypeScript config**

Create `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

**Step 3: Add git ignores**

Create `.gitignore`:

```txt
node_modules/
dist/
.next/
coverage/
test-results/
playwright-report/
.wdd/
```

**Step 4: Install dependencies**

Run:

```bash
npm install
```

Expected: a root `package-lock.json` is created.

**Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.base.json .gitignore
git commit -m "chore: set up workspace"
```

### Task 2: Harness Package Skeleton

**Files:**
- Create: `packages/wdd/package.json`
- Create: `packages/wdd/tsconfig.json`
- Create: `packages/wdd/vitest.config.ts`
- Create: `packages/wdd/src/index.ts`
- Create: `packages/wdd/src/cli.ts`

**Step 1: Create package manifest**

Create `packages/wdd/package.json`:

```json
{
  "name": "@wdd/harness",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "wdd": "./dist/cli.js"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "wdd": "tsx src/cli.ts"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "picocolors": "^1.1.1",
    "yaml": "^2.8.0"
  },
  "devDependencies": {
    "tsx": "^4.20.0",
    "typescript": "^5.8.0",
    "vitest": "^3.2.0"
  }
}
```

**Step 2: Create TypeScript config**

Create `packages/wdd/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true
  },
  "include": ["src/**/*.ts"]
}
```

**Step 3: Create Vitest config**

Create `packages/wdd/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node"
  }
});
```

**Step 4: Create CLI placeholder**

Create `packages/wdd/src/cli.ts`:

```ts
const [, , command = "help"] = process.argv;

if (command === "help") {
  console.log("wdd commands: index, impact, session, drift, verify");
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}
```

Create `packages/wdd/src/index.ts`:

```ts
export const version = "0.1.0";
```

**Step 5: Run tests and build**

Run:

```bash
npm run test
npm run build
```

Expected: both commands pass.

**Step 6: Commit**

```bash
git add packages/wdd
git commit -m "chore: scaffold wdd harness package"
```

### Task 3: Wiki Node Parser

**Files:**
- Create: `packages/wdd/src/node.ts`
- Create: `packages/wdd/src/parse.ts`
- Create: `packages/wdd/src/parse.test.ts`

**Step 1: Write failing parser tests**

Create `packages/wdd/src/parse.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseWikiMarkdown } from "./parse.js";

describe("parseWikiMarkdown", () => {
  it("parses required node frontmatter and body", () => {
    const node = parseWikiMarkdown(
      "pilot/wiki/actions/cancel-booking.md",
      `---
id: actions/cancel-booking
type: action
title: Cancel Booking
depends_on: [models/booking]
implemented_by: [pilot/app/src/actions/cancel-booking.ts]
verified_by: [pilot/app/tests/e2e/cancel-booking.spec.ts]
---
# Cancel Booking
`
    );

    expect(node.id).toBe("actions/cancel-booking");
    expect(node.type).toBe("action");
    expect(node.dependsOn).toEqual(["models/booking"]);
    expect(node.implementedBy).toEqual(["pilot/app/src/actions/cancel-booking.ts"]);
    expect(node.verifiedBy).toEqual(["pilot/app/tests/e2e/cancel-booking.spec.ts"]);
  });

  it("fails when id or type is missing", () => {
    expect(() => parseWikiMarkdown("x.md", "---\\ntitle: Missing\\n---\\n")).toThrow(/id/);
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w @wdd/harness -- parse.test.ts
```

Expected: FAIL because parser files do not exist.

**Step 3: Implement node types and parser**

Create `packages/wdd/src/node.ts`:

```ts
export type WikiNodeType =
  | "entity"
  | "model"
  | "action"
  | "page"
  | "flow"
  | "policy"
  | "qa"
  | "term"
  | "design"
  | "root";

export interface WikiNode {
  id: string;
  type: WikiNodeType;
  title: string;
  summary?: string;
  filePath: string;
  body: string;
  dependsOn: string[];
  implementedBy: string[];
  verifiedBy: string[];
  artifacts: string[];
  verifyCommands: string[];
}
```

Create `packages/wdd/src/parse.ts`:

```ts
import matter from "gray-matter";
import type { WikiNode, WikiNodeType } from "./node.js";

const NODE_TYPES = new Set<WikiNodeType>([
  "entity",
  "model",
  "action",
  "page",
  "flow",
  "policy",
  "qa",
  "term",
  "design",
  "root"
]);

const asList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

export function parseWikiMarkdown(filePath: string, raw: string): WikiNode {
  const parsed = matter(raw);
  const data = parsed.data;
  if (!data.id) throw new Error(`${filePath}: missing id`);
  if (!data.type) throw new Error(`${filePath}: missing type`);
  if (!NODE_TYPES.has(data.type)) throw new Error(`${filePath}: invalid type ${data.type}`);
  if (!data.title) throw new Error(`${filePath}: missing title`);

  return {
    id: String(data.id),
    type: data.type,
    title: String(data.title),
    summary: data.summary ? String(data.summary) : undefined,
    filePath,
    body: parsed.content,
    dependsOn: asList(data.depends_on),
    implementedBy: asList(data.implemented_by),
    verifiedBy: asList(data.verified_by),
    artifacts: asList(data.artifacts),
    verifyCommands: asList(data.verify)
  };
}
```

**Step 4: Run test to verify it passes**

Run:

```bash
npm run test -w @wdd/harness -- parse.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/wdd/src/node.ts packages/wdd/src/parse.ts packages/wdd/src/parse.test.ts
git commit -m "feat: parse wiki nodes"
```

### Task 4: Wiki Index And Graph Validation

**Files:**
- Create: `packages/wdd/src/index-wiki.ts`
- Create: `packages/wdd/src/index-wiki.test.ts`
- Modify: `packages/wdd/src/index.ts`

**Step 1: Write failing graph tests**

Create `packages/wdd/src/index-wiki.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";

describe("buildWikiIndex", () => {
  it("indexes nodes and dependents", () => {
    const index = buildWikiIndex([
      {
        id: "models/booking",
        type: "model",
        title: "Booking",
        filePath: "models/booking.md",
        body: "",
        dependsOn: ["entities/bookings"],
        implementedBy: [],
        verifiedBy: [],
        artifacts: [],
        verifyCommands: []
      },
      {
        id: "entities/bookings",
        type: "entity",
        title: "Bookings",
        filePath: "entities/bookings.md",
        body: "",
        dependsOn: [],
        implementedBy: [],
        verifiedBy: [],
        artifacts: [],
        verifyCommands: []
      }
    ]);

    expect(index.byId.get("models/booking")?.id).toBe("models/booking");
    expect(index.dependents.get("entities/bookings")).toEqual(["models/booking"]);
  });

  it("fails on dangling dependencies", () => {
    expect(() =>
      buildWikiIndex([
        {
          id: "actions/cancel-booking",
          type: "action",
          title: "Cancel",
          filePath: "actions/cancel-booking.md",
          body: "",
          dependsOn: ["models/missing"],
          implementedBy: [],
          verifiedBy: [],
          artifacts: [],
          verifyCommands: []
        }
      ])
    ).toThrow(/models\\/missing/);
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w @wdd/harness -- index-wiki.test.ts
```

Expected: FAIL because `index-wiki.ts` does not exist.

**Step 3: Implement graph index**

Create `packages/wdd/src/index-wiki.ts`:

```ts
import type { WikiNode } from "./node.js";

export interface WikiIndex {
  nodes: WikiNode[];
  byId: Map<string, WikiNode>;
  dependencies: Map<string, string[]>;
  dependents: Map<string, string[]>;
}

export function buildWikiIndex(nodes: WikiNode[]): WikiIndex {
  const byId = new Map<string, WikiNode>();
  for (const node of nodes) {
    if (byId.has(node.id)) throw new Error(`Duplicate node id: ${node.id}`);
    byId.set(node.id, node);
  }

  const dependencies = new Map<string, string[]>();
  const dependents = new Map<string, string[]>();

  for (const node of nodes) {
    dependencies.set(node.id, node.dependsOn);
    for (const dep of node.dependsOn) {
      if (!byId.has(dep)) throw new Error(`${node.id}: dangling dependency ${dep}`);
      const current = dependents.get(dep) ?? [];
      current.push(node.id);
      dependents.set(dep, current);
    }
  }

  return { nodes, byId, dependencies, dependents };
}
```

Modify `packages/wdd/src/index.ts`:

```ts
export * from "./node.js";
export * from "./parse.js";
export * from "./index-wiki.js";
```

**Step 4: Run tests**

Run:

```bash
npm run test -w @wdd/harness
```

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/wdd/src
git commit -m "feat: build wiki dependency index"
```

### Task 5: Impact Calculation

**Files:**
- Create: `packages/wdd/src/impact.ts`
- Create: `packages/wdd/src/impact.test.ts`
- Modify: `packages/wdd/src/index.ts`

**Step 1: Write failing impact tests**

Create `packages/wdd/src/impact.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import { calculateImpact } from "./impact.js";
import type { WikiNode } from "./node.js";

const node = (id: string, dependsOn: string[] = [], code: string[] = []): WikiNode => ({
  id,
  type: id.split("/")[0] as WikiNode["type"],
  title: id,
  filePath: `${id}.md`,
  body: "",
  dependsOn,
  implementedBy: code,
  verifiedBy: [],
  artifacts: [],
  verifyCommands: []
});

describe("calculateImpact", () => {
  it("returns upstream, downstream, and code files", () => {
    const index = buildWikiIndex([
      node("entities/bookings"),
      node("models/booking", ["entities/bookings"], ["pilot/app/src/models/booking.ts"]),
      node("actions/cancel-booking", ["models/booking"], ["pilot/app/src/actions/cancel-booking.ts"]),
      node("pages/booking-detail", ["actions/cancel-booking"], ["pilot/app/src/app/bookings/[id]/page.tsx"])
    ]);

    const impact = calculateImpact(index, "actions/cancel-booking");

    expect(impact.upstream).toEqual(["models/booking", "entities/bookings"]);
    expect(impact.downstream).toEqual(["pages/booking-detail"]);
    expect(impact.codeFiles).toContain("pilot/app/src/actions/cancel-booking.ts");
    expect(impact.codeFiles).toContain("pilot/app/src/app/bookings/[id]/page.tsx");
  });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w @wdd/harness -- impact.test.ts
```

Expected: FAIL because impact module does not exist.

**Step 3: Implement impact traversal**

Create `packages/wdd/src/impact.ts`:

```ts
import type { WikiIndex } from "./index-wiki.js";

export interface ImpactResult {
  nodeId: string;
  upstream: string[];
  downstream: string[];
  impactedNodes: string[];
  codeFiles: string[];
}

const walk = (edges: Map<string, string[]>, start: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  const queue = [...(edges.get(start) ?? [])];
  while (queue.length) {
    const next = queue.shift()!;
    if (seen.has(next)) continue;
    seen.add(next);
    out.push(next);
    queue.push(...(edges.get(next) ?? []));
  }
  return out;
};

export function calculateImpact(index: WikiIndex, nodeId: string): ImpactResult {
  const node = index.byId.get(nodeId);
  if (!node) throw new Error(`Unknown node: ${nodeId}`);

  const upstream = walk(index.dependencies, nodeId);
  const downstream = walk(index.dependents, nodeId);
  const impactedNodes = [nodeId, ...downstream];
  const codeFiles = new Set<string>();

  for (const id of impactedNodes) {
    const impacted = index.byId.get(id);
    if (!impacted) continue;
    for (const file of [...impacted.implementedBy, ...impacted.verifiedBy, ...impacted.artifacts]) {
      codeFiles.add(file);
    }
  }

  return { nodeId, upstream, downstream, impactedNodes, codeFiles: [...codeFiles].sort() };
}
```

Modify `packages/wdd/src/index.ts`:

```ts
export * from "./node.js";
export * from "./parse.js";
export * from "./index-wiki.js";
export * from "./impact.js";
```

**Step 4: Run tests**

Run:

```bash
npm run test -w @wdd/harness
```

Expected: PASS.

**Step 5: Commit**

```bash
git add packages/wdd/src
git commit -m "feat: calculate wiki impact"
```

### Task 6: Filesystem Loader And CLI Commands

**Files:**
- Create: `packages/wdd/src/load-wiki.ts`
- Create: `packages/wdd/src/load-wiki.test.ts`
- Modify: `packages/wdd/src/cli.ts`

**Step 1: Write failing loader test**

Create `packages/wdd/src/load-wiki.test.ts` using `fs.mkdtempSync` to create two markdown nodes, load them, and assert `buildWikiIndex` sees both nodes.

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w @wdd/harness -- load-wiki.test.ts
```

Expected: FAIL because loader does not exist.

**Step 3: Implement recursive markdown loader**

Create `packages/wdd/src/load-wiki.ts` with:

- `findMarkdownFiles(root: string): string[]`
- `loadWiki(root: string): WikiIndex`
- Use `parseWikiMarkdown` and `buildWikiIndex`.

**Step 4: Implement CLI**

Modify `packages/wdd/src/cli.ts` so these commands work:

```bash
npm run wdd -- index pilot/wiki
npm run wdd -- impact pilot/wiki actions/cancel-booking
```

Minimum output:

```txt
nodes: 19
actions/cancel-booking
upstream:
  - models/booking
downstream:
  - pages/booking-detail
code:
  - pilot/app/src/actions/cancel-booking.ts
```

**Step 5: Run tests and CLI help**

Run:

```bash
npm run test -w @wdd/harness
npm run wdd -- help
```

Expected: tests pass and help lists commands.

**Step 6: Commit**

```bash
git add packages/wdd/src
git commit -m "feat: load wiki and expose impact CLI"
```

### Task 7: Session Context Pack

**Files:**
- Create: `packages/wdd/src/session.ts`
- Create: `packages/wdd/src/session.test.ts`
- Modify: `packages/wdd/src/cli.ts`
- Modify: `packages/wdd/src/index.ts`

**Step 1: Write failing session test**

Create a test that builds an index for `actions/cancel-booking` and expects session output to include:

- Wiki-first cadence.
- Selected node title.
- Upstream nodes.
- Downstream nodes.
- Code files.
- Verification commands.

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w @wdd/harness -- session.test.ts
```

Expected: FAIL because session module does not exist.

**Step 3: Implement session formatter**

Create `formatSessionContext(index, nodeId): string`.

The output should be markdown so it can be pasted into Codex or Claude.

**Step 4: Add CLI command**

Support:

```bash
npm run wdd -- session pilot/wiki actions/cancel-booking
```

**Step 5: Run tests**

Run:

```bash
npm run test -w @wdd/harness
```

Expected: PASS.

**Step 6: Commit**

```bash
git add packages/wdd/src
git commit -m "feat: emit agent session context"
```

### Task 8: Drift And Verify MVP

**Files:**
- Create: `packages/wdd/src/drift.ts`
- Create: `packages/wdd/src/drift.test.ts`
- Create: `packages/wdd/src/verify.ts`
- Create: `packages/wdd/src/verify.test.ts`
- Modify: `packages/wdd/src/cli.ts`
- Modify: `packages/wdd/src/index.ts`

**Step 1: Write failing drift tests**

Test that a node with a missing `implemented_by` file is reported as missing.

**Step 2: Implement drift check**

Create `findMissingCodeReferences(index, repoRoot): string[]`.

Do not implement hash-based stale checks yet. Missing files are enough for MVP.

**Step 3: Write failing verify tests**

Test that a node with `verify: ["npm test"]` returns those commands for execution.

**Step 4: Implement verify command resolution**

Create `getVerifyCommands(index, nodeId): string[]`.

The CLI may print commands first. Actual command execution can be added after the pilot app exists.

**Step 5: Run tests**

Run:

```bash
npm run test -w @wdd/harness
```

Expected: PASS.

**Step 6: Commit**

```bash
git add packages/wdd/src
git commit -m "feat: add drift and verify metadata"
```

### Task 9: Wiki Templates

**Files:**
- Create: `templates/entity.md`
- Create: `templates/model.md`
- Create: `templates/action.md`
- Create: `templates/page.md`
- Create: `templates/flow.md`
- Create: `templates/policy.md`
- Create: `templates/qa.md`

**Step 1: Add templates**

Each template must include:

```yaml
id:
type:
title:
summary:
depends_on: []
implemented_by: []
verified_by: []
artifacts: []
verify: []
```

Use body sections that fit the type. For example, action templates need input, rules, effects, errors, and QA gates.

**Step 2: Validate templates manually**

Run:

```bash
npm run wdd -- help
```

Expected: CLI still works.

**Step 3: Commit**

```bash
git add templates
git commit -m "docs: add wiki node templates"
```

### Task 10: Mini Booking Wiki

**Files:**
- Create: `pilot/wiki/ROOT.md`
- Create all files listed in the design doc under `pilot/wiki/entities`, `models`, `actions`, `pages`, `flows`, `policies`, and `qa`.

**Step 1: Create the wiki pages**

Use the templates. Keep the domain small:

- Services: consultation, follow-up.
- Slots: available, booked, unavailable.
- Bookings: confirmed, rescheduled, cancelled.
- Policy: cancellation allowed until 24 hours before slot.

**Step 2: Ensure graph links are valid**

Run:

```bash
npm run wdd -- index pilot/wiki
```

Expected: node count matches created pages and no dangling dependency errors.

**Step 3: Check impact**

Run:

```bash
npm run wdd -- impact pilot/wiki actions/cancel-booking
```

Expected: output includes `pages/booking-detail`, `flows/manage-booking-flow`, `policies/cancellation-policy`, and cancel QA.

**Step 4: Commit**

```bash
git add pilot/wiki
git commit -m "docs: add mini booking pilot wiki"
```

### Task 11: Pilot Next.js Skeleton

**Files:**
- Create: `pilot/app/package.json`
- Create: `pilot/app/next.config.ts`
- Create: `pilot/app/tsconfig.json`
- Create: `pilot/app/src/app/layout.tsx`
- Create: `pilot/app/src/app/page.tsx`
- Create: `pilot/app/src/lib/seed-store.ts`

**Step 1: Scaffold minimal Next app manually**

Keep dependencies minimal: Next, React, React DOM, Zod, Vitest.

**Step 2: Add seed store**

Create an in-memory repository in `pilot/app/src/lib/seed-store.ts` for services, slots, and bookings. This keeps the first pilot independent from a live database.

**Step 3: Run app build**

Run:

```bash
npm install
npm run build -w pilot-booking-app
```

Expected: Next build passes.

**Step 4: Commit**

```bash
git add pilot/app package-lock.json
git commit -m "chore: scaffold mini booking app"
```

### Task 12: Agent-Authored Pilot Implementation

**Files:**
- Create code files referenced by the pilot wiki `implemented_by`, `verified_by`, and `artifacts` fields.

**Step 1: Start from the wiki**

Run:

```bash
npm run wdd -- session pilot/wiki actions/create-booking
```

Use the output as the implementation context.

**Step 2: Implement models and actions**

Implement Zod models, seed-backed server actions, and unit tests.

**Step 3: Implement pages and screens**

Implement service list, new booking, booking detail, and booking complete.

**Step 4: Implement E2E tests**

Implement create, reschedule, cancel, unavailable slot, and policy-blocked cancellation scenarios.

**Step 5: Run verification**

Run:

```bash
npm run test
npm run build
npm run wdd -- drift pilot/wiki
```

Expected: tests and build pass; drift has no missing referenced files.

**Step 6: Commit**

```bash
git add pilot/app pilot/wiki package-lock.json
git commit -m "feat: implement mini booking pilot"
```

### Task 13: Root AGENTS Cadence

**Files:**
- Create: `AGENTS.md`

**Step 1: Add WDD working rules**

Document the mandatory cadence:

1. Edit wiki first.
2. Run impact.
3. Read impacted wiki nodes.
4. Modify only impacted code files.
5. Run verify/drift.

**Step 2: Include exceptions**

Infrastructure-only work must use a tooling/process node or a design plan.

**Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: add wiki-first agent cadence"
```

### Task 14: Final Verification

**Files:**
- No new files.

**Step 1: Run full checks**

Run:

```bash
npm run test
npm run build
npm run wdd -- index pilot/wiki
npm run wdd -- impact pilot/wiki actions/cancel-booking
npm run wdd -- session pilot/wiki actions/cancel-booking
npm run wdd -- drift pilot/wiki
```

Expected:

- Tests pass.
- TypeScript build passes.
- Pilot wiki indexes cleanly.
- Cancel booking impact includes page, flow, policy, QA, and code files.
- Session output is useful as an agent handoff.
- Drift reports no missing files after implementation.

**Step 2: Commit if needed**

```bash
git status --short
```

Expected: clean working tree.
