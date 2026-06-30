import type { WddWorkflowPhase, WikiNode } from "./node.js";
import type { WikiIndex } from "./index-wiki.js";

export type WorkflowSeverity = "pending" | "error";

export interface WorkflowAttentionItem {
  nodeId: string;
  phase: WddWorkflowPhase;
  severity: WorkflowSeverity;
  message: string;
}

export interface StatusSummaryIssue {
  nodeId: string;
  message: string;
}

const PHASE_SUMMARY: Record<WddWorkflowPhase, string> = {
  wiki: "📝 위키 작성 중",
  coding: "🛠️ 코드 반영 필요",
  verification: "🧪 검증 필요",
  verified: "✅ 검증 완료",
  blocked: "⚠️ 막힘"
};

const CODE_SUMMARY: Record<WikiNode["wddStatus"]["code"], string> = {
  pending: "코드 대기",
  reflected: "코드 반영됨",
  not_required: "코드 불필요"
};

const VERIFICATION_SUMMARY: Record<WikiNode["wddStatus"]["verification"], string> = {
  pending: "검증 대기",
  passed: "검증 통과",
  failed: "검증 실패",
  not_required: "검증 불필요"
};

export function formatStatusSummary(node: WikiNode): string {
  const { phase, code, verification } = node.wddStatus;
  return `상태: ${PHASE_SUMMARY[phase]} · ${CODE_SUMMARY[code]} · ${VERIFICATION_SUMMARY[verification]}`;
}

function extractStatusSummary(body: string): string | undefined {
  const lines = body.split(/\r?\n/);
  let inStatusSection = false;

  for (const line of lines) {
    if (/^##\s+상태\s*$/.test(line)) {
      inStatusSection = true;
      continue;
    }

    if (inStatusSection && /^##\s+/.test(line)) return undefined;
    if (inStatusSection && line.trim()) return line.trim();
  }

  return undefined;
}

function statusSummaryIssueForNode(node: WikiNode): StatusSummaryIssue[] {
  const actual = extractStatusSummary(node.body);
  const expected = formatStatusSummary(node);

  if (!actual) {
    return [
      {
        nodeId: node.id,
        message: "Missing status summary section. Add: ## 상태"
      }
    ];
  }

  if (actual !== expected) {
    return [
      {
        nodeId: node.id,
        message: `Status summary must be exactly: ${expected}`
      }
    ];
  }

  return [];
}

export function findStatusSummaryIssues(index: WikiIndex, nodeId?: string): StatusSummaryIssue[] {
  const nodes = nodeId ? [index.byId.get(nodeId)].filter((node): node is WikiNode => !!node) : index.nodes;
  if (nodeId && !nodes.length) throw new Error(`Unknown node: ${nodeId}`);
  return nodes.flatMap(statusSummaryIssueForNode);
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
