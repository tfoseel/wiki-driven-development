import fs from "node:fs";
import path from "node:path";
import { findMissingCodeReferences } from "./drift.js";
import type { WikiIndex } from "./index-wiki.js";
import { collectScreenshotTargets } from "./screenshots.js";
import { findWorkflowAttention } from "./workflow.js";

export type ReadyIssueKind = "workflow" | "reference" | "screenshot" | "verify";

export interface ReadyIssue {
  kind: ReadyIssueKind;
  nodeId: string;
  message: string;
}

export interface ReadyResult {
  ok: boolean;
  issues: ReadyIssue[];
  summary: {
    nodes: number;
    screenshotTargets: number;
  };
}

export function checkReady(
  index: WikiIndex,
  repoRoot: string,
  fileExists: (file: string) => boolean = (file) => fs.existsSync(path.resolve(repoRoot, file))
): ReadyResult {
  const issues: ReadyIssue[] = [];

  for (const item of findWorkflowAttention(index)) {
    issues.push({
      kind: "workflow",
      nodeId: item.nodeId,
      message: item.message
    });
  }

  for (const item of findMissingCodeReferences(index, repoRoot).filter((ref) => !fileExists(ref.file))) {
    issues.push({
      kind: "reference",
      nodeId: item.nodeId,
      message: `Missing ${item.field}: ${item.file}`
    });
  }

  for (const node of index.nodes) {
    if (node.wddStatus.verification === "passed" && node.type !== "root" && !node.verifyCommands.length) {
      issues.push({
        kind: "verify",
        nodeId: node.id,
        message: "Verified nodes must declare verify commands."
      });
    }

    if (node.type === "page") {
      if ((node.wddStatus.code === "reflected" || node.wddStatus.verification === "passed") && !node.screenshots.length) {
        issues.push({
          kind: "screenshot",
          nodeId: node.id,
          message: "Reflected page nodes must declare at least one screenshot."
        });
      }

      for (const screenshot of node.screenshots) {
        if (!screenshot.route) {
          issues.push({
            kind: "screenshot",
            nodeId: node.id,
            message: `Page screenshots must declare route: ${screenshot.path}`
          });
        }
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    summary: {
      nodes: index.nodes.length,
      screenshotTargets: collectScreenshotTargets(index).length
    }
  };
}

export function formatReadyReport(result: ReadyResult): string {
  return [
    "ready status:",
    `  ok: ${result.ok ? "yes" : "no"}`,
    `  nodes: ${result.summary.nodes}`,
    `  screenshot targets: ${result.summary.screenshotTargets}`,
    `  issues: ${result.issues.length}`,
    ...(result.issues.length ? result.issues.map((issue) => `  - [${issue.kind}] ${issue.nodeId}: ${issue.message}`) : ["  all ready checks passed"])
  ].join("\n");
}
