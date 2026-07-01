import fs from "node:fs";
import path from "node:path";
import { findMissingCodeReferences } from "./drift.js";
import type { WikiIndex } from "./index-wiki.js";
import { collectScreenshotTargets } from "./screenshots.js";
import { collectFlowTreeTargets } from "./flow-trees.js";
import { findStatusSummaryIssues, findWorkflowAttention } from "./workflow.js";

export type ReadyIssueKind =
  | "workflow"
  | "reference"
  | "screenshot"
  | "flow-tree"
  | "verify"
  | "status"
  | "metadata"
  | "asset-path"
  | "legacy";

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

function normalizePathForMarkdown(value: string): string {
  return value.replaceAll(path.sep, "/").replaceAll("\\", "/");
}

function markdownPathCandidates(nodeFilePath: string, repoRoot: string, targetPath: string): string[] {
  const absoluteNodePath = path.isAbsolute(nodeFilePath) ? nodeFilePath : path.resolve(repoRoot, nodeFilePath);
  const absoluteTargetPath = path.isAbsolute(targetPath) ? targetPath : path.resolve(repoRoot, targetPath);
  const relativeTarget = normalizePathForMarkdown(path.relative(path.dirname(absoluteNodePath), absoluteTargetPath));
  return Array.from(new Set([normalizePathForMarkdown(targetPath), relativeTarget, `./${relativeTarget}`]));
}

function hasInlineMarkdownImage(body: string, candidates: string[]): boolean {
  const normalizedBody = body.replaceAll("\\", "/");
  return candidates.some(
    (candidate) =>
      normalizedBody.includes(`](${candidate})`) ||
      normalizedBody.includes(`](${candidate} `) ||
      normalizedBody.includes(`src="${candidate}"`) ||
      normalizedBody.includes(`src='${candidate}'`)
  );
}

function isWikiLocalNonMarkdownPath(file: string): boolean {
  const normalized = normalizePathForMarkdown(file);
  return normalized.startsWith("wiki/") && !normalized.endsWith(".md");
}

function sidecarPrefixForNode(nodeFilePath: string, repoRoot: string): string | undefined {
  const normalized = normalizePathForMarkdown(path.isAbsolute(nodeFilePath) ? path.relative(repoRoot, nodeFilePath) : nodeFilePath);
  if (!normalized.startsWith("wiki/") || !normalized.endsWith(".md")) return undefined;
  return normalized.slice(0, -".md".length) + "/";
}

function pushWikiEvidencePathIssue(issues: ReadyIssue[], nodeId: string, nodeFilePath: string, repoRoot: string, field: string, file: string): void {
  if (!isWikiLocalNonMarkdownPath(file)) return;

  const normalized = normalizePathForMarkdown(file);
  const sidecarPrefix = sidecarPrefixForNode(nodeFilePath, repoRoot);
  if (sidecarPrefix && normalized.startsWith(sidecarPrefix)) return;

  issues.push({
    kind: "asset-path",
    nodeId,
    message: `${field} under wiki/ must live next to the owning wiki node: expected ${sidecarPrefix ?? "a node sidecar folder"}`
  });
}

const LEGACY_PRE_IMPLEMENTATION_STATUSES = new Set(["code-ssot", "observed", "specified", "spec-frozen"]);

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

  for (const item of findStatusSummaryIssues(index)) {
    issues.push({
      kind: "status",
      nodeId: item.nodeId,
      message: item.message
    });
  }

  for (const node of index.nodes) {
    if (node.metadataFormat === "frontmatter") {
      issues.push({
        kind: "metadata",
        nodeId: node.id,
        message: "WDD metadata must be hidden in an HTML comment: <!-- wdd ... -->"
      });
    }
  }

  for (const item of findMissingCodeReferences(index, repoRoot).filter((ref) => !fileExists(ref.file))) {
    issues.push({
      kind: "reference",
      nodeId: item.nodeId,
      message: `Missing ${item.field}: ${item.file}`
    });
  }

  for (const node of index.nodes) {
    if (
      node.legacy &&
      LEGACY_PRE_IMPLEMENTATION_STATUSES.has(node.legacy.status) &&
      (node.wddStatus.code === "reflected" || node.wddStatus.phase === "verified" || node.wddStatus.verification === "passed")
    ) {
      issues.push({
        kind: "legacy",
        nodeId: node.id,
        message: "Legacy observed/spec/frozen nodes must not claim wiki-derived code reflection."
      });
    }

    if (node.legacy && LEGACY_PRE_IMPLEMENTATION_STATUSES.has(node.legacy.status) && node.implementedBy.length) {
      issues.push({
        kind: "legacy",
        nodeId: node.id,
        message: "Legacy observed/spec/frozen nodes must keep implemented_by empty until wiki-derived code exists."
      });
    }

    for (const artifact of node.artifacts) {
      pushWikiEvidencePathIssue(issues, node.id, node.filePath, repoRoot, "artifacts", artifact);
    }

    for (const screenshot of node.screenshots) {
      pushWikiEvidencePathIssue(issues, node.id, node.filePath, repoRoot, "screenshots", screenshot.path);
    }

    if (node.wddStatus.verification === "passed" && node.type !== "root" && !node.verifyCommands.length) {
      issues.push({
        kind: "verify",
        nodeId: node.id,
        message: "Verified nodes must declare verify commands."
      });
    }

    if (node.type === "screen") {
      if ((node.wddStatus.code === "reflected" || node.wddStatus.verification === "passed") && !node.screenshots.length) {
        issues.push({
          kind: "screenshot",
          nodeId: node.id,
          message: "Reflected screen nodes must declare at least one screenshot."
        });
      }

      for (const screenshot of node.screenshots) {
        if (!screenshot.route) {
          issues.push({
            kind: "screenshot",
            nodeId: node.id,
            message: `Screen screenshots must declare route: ${screenshot.path}`
          });
        }

        if (!hasInlineMarkdownImage(node.body, markdownPathCandidates(node.filePath, repoRoot, screenshot.path))) {
          issues.push({
            kind: "screenshot",
            nodeId: node.id,
            message: `Screen screenshot must be embedded inline in markdown: ${screenshot.path}`
          });
        }
      }
    }

    if (node.type === "flow") {
      const flowTreeTargets = collectFlowTreeTargets({ ...index, nodes: [node] }, repoRoot);
      if (node.wddStatus.verification === "passed" && !flowTreeTargets.length) {
        issues.push({
          kind: "flow-tree",
          nodeId: node.id,
          message: "Verified flow nodes must embed a generated flow tree capture image."
        });
      }

      for (const flowTreeTarget of flowTreeTargets) {
        pushWikiEvidencePathIssue(issues, node.id, node.filePath, repoRoot, "flow tree captures", flowTreeTarget.path);

        if (!fileExists(flowTreeTarget.path)) {
          issues.push({
            kind: "flow-tree",
            nodeId: node.id,
            message: `Missing generated flow tree capture: ${flowTreeTarget.path}`
          });
        }
      }

      for (const dependencyId of node.dependsOn) {
        const dependency = index.byId.get(dependencyId);
        if (dependency?.type !== "screen") continue;

        for (const screenshot of dependency.screenshots) {
          if (!hasInlineMarkdownImage(node.body, markdownPathCandidates(node.filePath, repoRoot, screenshot.path))) {
            issues.push({
              kind: "screenshot",
              nodeId: node.id,
              message: `Flow screen tree must embed dependent screen screenshot: ${screenshot.path}`
            });
          }
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
