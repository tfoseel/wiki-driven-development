import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findMissingCodeReferences } from "../src/drift.js";
import { buildWikiIndex } from "../src/index-wiki.js";
import type { WikiNode } from "../src/node.js";

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
  assets: [],
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
    fs.mkdirSync(path.join(repoRoot, "wiki/화면/existing-page"), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, "wiki/화면/existing-page/스크린샷.png"), "");

    const index = buildWikiIndex([
      node({
        id: "screens/existing-page",
        type: "screen",
        title: "Existing Page",
        screenshots: [{ path: "wiki/화면/existing-page/스크린샷.png" }]
      }),
      node({
        id: "screens/missing-page",
        type: "screen",
        title: "Missing Page",
        screenshots: [{ path: "wiki/화면/missing-page/스크린샷.png" }]
      })
    ]);

    expect(findMissingCodeReferences(index, repoRoot)).toEqual([
      {
        nodeId: "screens/missing-page",
        field: "screenshots",
        file: "wiki/화면/missing-page/스크린샷.png"
      }
    ]);
  });

  it("reports missing local product asset files", () => {
    const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wdd-repo-"));
    tempDirs.push(repoRoot);
    fs.mkdirSync(path.join(repoRoot, "public/images"), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, "public/images/existing.png"), "");

    const index = buildWikiIndex([
      node({
        id: "screens/home",
        type: "screen",
        title: "Home",
        assets: [
          { path: "public/images/existing.png", purpose: "Existing hero" },
          { path: "public/images/missing.png", purpose: "Missing hero" },
          { path: "https://cdn.example.com/remote.png", purpose: "Remote CDN asset" }
        ]
      })
    ]);

    expect(findMissingCodeReferences(index, repoRoot)).toEqual([
      {
        nodeId: "screens/home",
        field: "assets",
        file: "public/images/missing.png"
      }
    ]);
  });
});
