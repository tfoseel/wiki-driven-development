import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import type { WikiNode, WddStatus } from "./node.js";
import { findWorkflowAttention, formatWorkflowStatus } from "./workflow.js";

const status = (input: Partial<WddStatus>): WddStatus => ({
  phase: "verified",
  code: "reflected",
  verification: "passed",
  ...input
});

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type" | "title">): WikiNode => ({
  filePath: `${input.id}.md`,
  body: "",
  summary: undefined,
  dependsOn: [],
  implementedBy: [],
  verifiedBy: [],
  artifacts: [],
  screenshots: [],
  verifyCommands: [],
  wddStatus: status({}),
  ...input
});

describe("workflow status", () => {
  it("returns no attention items for verified nodes", () => {
    const index = buildWikiIndex([
      node({ id: "pages/example-page", type: "page", title: "Example Page" })
    ]);

    expect(findWorkflowAttention(index)).toEqual([]);
    expect(formatWorkflowStatus(index)).toContain("all nodes verified");
  });

  it("marks wiki changes that still need coding", () => {
    const index = buildWikiIndex([
      node({
        id: "pages/example-page",
        type: "page",
        title: "Example Page",
        wddStatus: status({ phase: "coding", code: "pending", verification: "pending" })
      })
    ]);

    expect(findWorkflowAttention(index)).toEqual([
      {
        nodeId: "pages/example-page",
        phase: "coding",
        severity: "pending",
        message: "Next phase: update referenced code before verification."
      }
    ]);
  });

  it("flags inconsistent verified metadata as an error", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/example-action",
        type: "action",
        title: "Example Action",
        wddStatus: status({ phase: "verified", code: "pending", verification: "passed" })
      })
    ]);

    expect(findWorkflowAttention(index)).toEqual([
      {
        nodeId: "actions/example-action",
        phase: "verified",
        severity: "error",
        message: "Verified phase requires code reflected or not_required, and verification passed or not_required."
      }
    ]);
  });
});
