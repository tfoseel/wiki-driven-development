import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findMissingCodeReferences } from "./drift.js";
import { buildWikiIndex } from "./index-wiki.js";
import type { WikiNode } from "./node.js";

const tempDirs: string[] = [];

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type" | "title">): WikiNode => ({
  filePath: `${input.id}.md`,
  body: "",
  wddStatus: {
    phase: "verified",
    code: "reflected",
    verification: "passed"
  },
  dependsOn: [],
  implementedBy: [],
    verifiedBy: [],
    artifacts: [],
    screenshots: [],
    verifyCommands: [],
    ...input
});

describe("findMissingCodeReferences", () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("reports missing implemented_by files", () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wdd-repo-"));
    tempDirs.push(repoRoot);
    fs.mkdirSync(path.join(repoRoot, "app/src/actions"), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, "app/src/actions/existing-action.ts"), "");

    const index = buildWikiIndex([
      node({
        id: "actions/existing-action",
        type: "action",
        title: "Existing Action",
        implementedBy: ["app/src/actions/existing-action.ts"]
      }),
      node({
        id: "actions/missing-action",
        type: "action",
        title: "Missing Action",
        implementedBy: ["app/src/actions/missing-action.ts"]
      })
    ]);

    expect(findMissingCodeReferences(index, repoRoot)).toEqual([
      {
        nodeId: "actions/missing-action",
        field: "implemented_by",
        file: "app/src/actions/missing-action.ts"
      }
    ]);
  });

  it("reports missing screenshot evidence files", () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wdd-repo-"));
    tempDirs.push(repoRoot);
    fs.mkdirSync(path.join(repoRoot, "wiki/assets/screenshots/pages"), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, "wiki/assets/screenshots/pages/existing-page.png"), "");

    const index = buildWikiIndex([
      node({
        id: "pages/existing-page",
        type: "page",
        title: "Existing Page",
        screenshots: [{ path: "wiki/assets/screenshots/pages/existing-page.png" }]
      }),
      node({
        id: "pages/missing-page",
        type: "page",
        title: "Missing Page",
        screenshots: [{ path: "wiki/assets/screenshots/pages/missing-page.png" }]
      })
    ]);

    expect(findMissingCodeReferences(index, repoRoot)).toEqual([
      {
        nodeId: "pages/missing-page",
        field: "screenshots",
        file: "wiki/assets/screenshots/pages/missing-page.png"
      }
    ]);
  });
});
