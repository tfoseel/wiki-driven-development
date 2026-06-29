import type { WddWorkflowPhase, WikiNode } from "./node.js";
import type { WikiIndex } from "./index-wiki.js";

export type WorkflowSeverity = "pending" | "error";

export interface WorkflowAttentionItem {
  nodeId: string;
  phase: WddWorkflowPhase;
  severity: WorkflowSeverity;
  message: string;
}

export function nextWorkflowMessage(node: WikiNode): string {
  const { phase } = node.wddStatus;
  if (phase === "wiki") return "Current phase: finish wiki edits, then mark coding.";
  if (phase === "coding") return "Next phase: update referenced code before verification.";
  if (phase === "verification") return "Next phase: run declared verification and mark verified.";
  if (phase === "blocked") return node.wddStatus.note ?? "Workflow is blocked; resolve the note before continuing.";
  return "Workflow is aligned.";
}

function attentionForNode(node: WikiNode): WorkflowAttentionItem[] {
  const { phase, code, verification, note } = node.wddStatus;

  if (phase === "verified") {
    const codeDone = code === "reflected" || code === "not_required";
    const verificationDone = verification === "passed" || verification === "not_required";
    if (!codeDone || !verificationDone) {
      return [
        {
          nodeId: node.id,
          phase,
          severity: "error",
          message: "Verified phase requires code reflected or not_required, and verification passed or not_required."
        }
      ];
    }
    return [];
  }

  if (phase === "verification" && code !== "reflected" && code !== "not_required") {
    return [
      {
        nodeId: node.id,
        phase,
        severity: "error",
        message: "Verification phase requires code reflected or not_required."
      }
    ];
  }

  return [
    {
      nodeId: node.id,
      phase,
      severity: phase === "blocked" || note === "missing wdd_status" ? "error" : "pending",
      message: nextWorkflowMessage(node)
    }
  ];
}

export function findWorkflowAttention(index: WikiIndex, nodeId?: string): WorkflowAttentionItem[] {
  const nodes = nodeId ? [index.byId.get(nodeId)].filter((node): node is WikiNode => !!node) : index.nodes;
  if (nodeId && !nodes.length) throw new Error(`Unknown node: ${nodeId}`);
  return nodes.flatMap(attentionForNode);
}

export function formatWorkflowStatus(index: WikiIndex, nodeId?: string): string {
  const nodes = nodeId ? [index.byId.get(nodeId)].filter((node): node is WikiNode => !!node) : index.nodes;
  if (nodeId && !nodes.length) throw new Error(`Unknown node: ${nodeId}`);
  const attention = findWorkflowAttention(index, nodeId);
  const verifiedCount = nodes.filter((node) => node.wddStatus.phase === "verified").length;

  return [
    "workflow status:",
    `  verified: ${verifiedCount}`,
    `  attention: ${attention.length}`,
    ...(attention.length ? attention.map((item) => `  - [${item.severity}] ${item.nodeId} (${item.phase}): ${item.message}`) : ["  all nodes verified"])
  ].join("\n");
}
