import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "../src/index-wiki.js";
import type { WikiNode, WddStatus } from "../src/node.js";
import { findStatusSummaryIssues, findWorkflowAttention, formatStatusSummary, formatWorkflowStatus } from "../src/workflow.js";

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
      node({ id: "screens/example-screen", type: "screen", title: "Example Screen" })
    ]);

    expect(findWorkflowAttention(index)).toEqual([]);
    expect(formatWorkflowStatus(index)).toContain("all nodes verified");
  });

  it("marks wiki changes that still need coding", () => {
    const index = buildWikiIndex([
      node({
        id: "screens/example-screen",
        type: "screen",
        title: "Example Screen",
        wddStatus: status({ phase: "coding", code: "pending", verification: "pending" })
      })
    ]);

    expect(findWorkflowAttention(index)).toEqual([
      {
        nodeId: "screens/example-screen",
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

  it("formats a canonical human status summary from wdd_status", () => {
    const wikiNode = node({
      id: "actions/example-action",
      type: "action",
      title: "Example Action"
    });

    expect(formatStatusSummary(wikiNode)).toBe("상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과");
  });

  it("requires the markdown status line to match wdd_status", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/example-action",
        type: "action",
        title: "Example Action",
        body: ["## 상태", "", "상태: ✅ 완료됨"].join("\n")
      })
    ]);

    expect(findStatusSummaryIssues(index)).toEqual([
      {
        nodeId: "actions/example-action",
        message: "Status summary must be exactly: 상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과"
      }
    ]);
  });

  it("requires every markdown node to expose the canonical status line", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/example-action",
        type: "action",
        title: "Example Action",
        body: "# Example Action"
      })
    ]);

    expect(findStatusSummaryIssues(index)).toEqual([
      {
        nodeId: "actions/example-action",
        message: "Missing status summary section. Add: ## 상태"
      }
    ]);
  });
});
