import fs from "node:fs";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { calculateImpact } from "./impact.js";
import type { WikiIndex } from "./index-wiki.js";
import type { WddCodeStatus, WddVerificationStatus, WddWorkflowPhase, WikiNode } from "./node.js";
import { parseWikiMarkdown } from "./parse.js";
import { formatStatusSummary } from "./workflow.js";

export interface WikiStatusUpdate {
  phase?: WddWorkflowPhase;
  code?: WddCodeStatus;
  verification?: WddVerificationStatus;
  note?: string;
  clearNote?: boolean;
}

export interface MarkWikiStatusOptions {
  withImpact?: boolean;
}

export interface MarkWikiStatusResult {
  nodeId: string;
  filePath: string;
  status: WikiNode["wddStatus"];
}

const HIDDEN_WDD_PATTERN = /^\s*<!--\s*wdd\s*\n([\s\S]*?)\n-->\s*/;

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

function parseHiddenMetadata(filePath: string, raw: string): { data: Record<string, unknown>; end: number } {
  const match = raw.match(HIDDEN_WDD_PATTERN);
  if (!match) throw new Error(`${filePath}: mark requires hidden WDD metadata: <!-- wdd ... -->`);
  return {
    data: asRecord(parseYaml(match[1])),
    end: match[0].length
  };
}

function replaceHiddenMetadata(raw: string, end: number, data: Record<string, unknown>): string {
  const yaml = stringifyYaml(data).trimEnd();
  return `<!-- wdd\n${yaml}\n-->\n${raw.slice(end).replace(/^\n+/, "")}`;
}

function replaceVisibleStatusSummary(raw: string, summary: string): string {
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const lines = raw.split(/\r?\n/);
  const statusHeadingIndex = lines.findIndex((line) => /^##\s+상태\s*$/.test(line));

  if (statusHeadingIndex >= 0) {
    let summaryIndex = statusHeadingIndex + 1;
    while (summaryIndex < lines.length && !lines[summaryIndex].trim()) summaryIndex += 1;

    if (summaryIndex < lines.length && !/^##\s+/.test(lines[summaryIndex])) {
      lines[summaryIndex] = summary;
    } else {
      lines.splice(statusHeadingIndex + 1, 0, "", summary);
    }

    return lines.join(eol);
  }

  const firstBodyHeadingIndex = lines.findIndex((line) => /^#\s+/.test(line));
  const insertAt = firstBodyHeadingIndex >= 0 ? firstBodyHeadingIndex + 1 : 0;
  lines.splice(insertAt, 0, "", "## 상태", "", summary);
  return lines.join(eol);
}

export function updateWikiNodeStatusMarkdown(filePath: string, raw: string, update: WikiStatusUpdate): string {
  const hidden = parseHiddenMetadata(filePath, raw);
  const node = parseWikiMarkdown(filePath, raw);
  const statusNote =
    update.clearNote
      ? undefined
      : update.note !== undefined
        ? update.note
        : node.wddStatus.note === "missing wdd_status"
          ? undefined
          : node.wddStatus.note;
  const status: WikiNode["wddStatus"] = {
    phase: update.phase ?? node.wddStatus.phase,
    code: update.code ?? node.wddStatus.code,
    verification: update.verification ?? node.wddStatus.verification,
    ...(statusNote ? { note: statusNote } : {})
  };

  hidden.data.wdd_status = status;
  const withMetadata = replaceHiddenMetadata(raw, hidden.end, hidden.data);
  const updatedNode = parseWikiMarkdown(filePath, withMetadata);
  return replaceVisibleStatusSummary(withMetadata, formatStatusSummary(updatedNode));
}

export function selectStatusUpdateNodes(index: WikiIndex, nodeId: string, withImpact = false): WikiNode[] {
  const target = index.byId.get(nodeId);
  if (!target) throw new Error(`Unknown node: ${nodeId}`);
  const ids = withImpact ? calculateImpact(index, nodeId).impactedNodes : [nodeId];
  return ids.map((id) => {
    const node = index.byId.get(id);
    if (!node) throw new Error(`Unknown node: ${id}`);
    return node;
  });
}

export function markWikiStatus(
  index: WikiIndex,
  nodeId: string,
  update: WikiStatusUpdate,
  options: MarkWikiStatusOptions = {}
): MarkWikiStatusResult[] {
  const nodes = selectStatusUpdateNodes(index, nodeId, options.withImpact ?? false);

  return nodes.map((node) => {
    const raw = fs.readFileSync(node.filePath, "utf8");
    const next = updateWikiNodeStatusMarkdown(node.filePath, raw, update);
    if (next !== raw) fs.writeFileSync(node.filePath, next);
    const updated = parseWikiMarkdown(node.filePath, next);
    return {
      nodeId: updated.id,
      filePath: updated.filePath,
      status: updated.wddStatus
    };
  });
}
