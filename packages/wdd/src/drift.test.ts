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
    fs.mkdirSync(path.join(repoRoot, "pilot/app/src/actions"), { recursive: true });
    fs.writeFileSync(path.join(repoRoot, "pilot/app/src/actions/create-booking.ts"), "");

    const index = buildWikiIndex([
      node({
        id: "actions/create-booking",
        type: "action",
        title: "Create Booking",
        implementedBy: ["pilot/app/src/actions/create-booking.ts"]
      }),
      node({
        id: "actions/cancel-booking",
        type: "action",
        title: "Cancel Booking",
        implementedBy: ["pilot/app/src/actions/cancel-booking.ts"]
      })
    ]);

    expect(findMissingCodeReferences(index, repoRoot)).toEqual([
      {
        nodeId: "actions/cancel-booking",
        field: "implemented_by",
        file: "pilot/app/src/actions/cancel-booking.ts"
      }
    ]);
  });
});
