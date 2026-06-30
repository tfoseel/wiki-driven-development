import matter from "gray-matter";
import type {
  WddCodeStatus,
  WddStatus,
  WddVerificationStatus,
  WddWorkflowPhase,
  WikiNode,
  WikiNodeType,
  WikiScreenshot
} from "./node.js";

const NODE_TYPES = new Set<WikiNodeType>([
  "entity",
  "model",
  "action",
  "page",
  "flow",
  "policy",
  "qa",
  "term",
  "design",
  "root"
]);

const WDD_PHASES = new Set<WddWorkflowPhase>(["wiki", "coding", "verification", "verified", "blocked"]);
const WDD_CODE_STATUSES = new Set<WddCodeStatus>(["pending", "reflected", "not_required"]);
const WDD_VERIFICATION_STATUSES = new Set<WddVerificationStatus>(["pending", "passed", "failed", "not_required"]);

const asList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;

function parseWddStatus(filePath: string, value: unknown): WddStatus {
  const status = asRecord(value);
  if (!status) {
    return {
      phase: "wiki",
      code: "pending",
      verification: "pending",
      note: "missing wdd_status"
    };
  }

  const phase = String(status.phase ?? "");
  const code = String(status.code ?? "");
  const verification = String(status.verification ?? "");

  if (!WDD_PHASES.has(phase as WddWorkflowPhase)) throw new Error(`${filePath}: invalid wdd_status.phase ${phase}`);
  if (!WDD_CODE_STATUSES.has(code as WddCodeStatus)) throw new Error(`${filePath}: invalid wdd_status.code ${code}`);
  if (!WDD_VERIFICATION_STATUSES.has(verification as WddVerificationStatus)) {
    throw new Error(`${filePath}: invalid wdd_status.verification ${verification}`);
  }

  return {
    phase: phase as WddWorkflowPhase,
    code: code as WddCodeStatus,
    verification: verification as WddVerificationStatus,
    note: status.note ? String(status.note) : undefined
  };
}

function defaultWddStatus(): WddStatus {
  return {
    phase: "wiki",
    code: "pending",
    verification: "pending",
    note: "missing wdd_status"
  };
}

function parseScreenshots(filePath: string, value: unknown): WikiScreenshot[] {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];

  return items.map((item) => {
    if (typeof item === "string") return { path: item };
    const screenshot = asRecord(item);
    if (!screenshot?.path) throw new Error(`${filePath}: screenshot entry missing path`);
    return {
      path: String(screenshot.path),
      alt: screenshot.alt ? String(screenshot.alt) : undefined,
      route: screenshot.route ? String(screenshot.route) : undefined,
      capturedAt: screenshot.captured_at ? String(screenshot.captured_at) : screenshot.capturedAt ? String(screenshot.capturedAt) : undefined
    };
  });
}

export function parseWikiMarkdown(filePath: string, raw: string): WikiNode {
  const parsed = matter(raw);
  const data = parsed.data;
  if (!data.id) throw new Error(`${filePath}: missing id`);
  if (!data.type) throw new Error(`${filePath}: missing type`);
  if (!NODE_TYPES.has(data.type)) throw new Error(`${filePath}: invalid type ${data.type}`);
  if (!data.title) throw new Error(`${filePath}: missing title`);
  const type = data.type as WikiNodeType;

  return {
    id: String(data.id),
    type,
    title: String(data.title),
    summary: data.summary ? String(data.summary) : undefined,
    wddStatus: data.wdd_status ? parseWddStatus(filePath, data.wdd_status) : defaultWddStatus(),
    filePath,
    body: parsed.content,
    dependsOn: asList(data.depends_on),
    implementedBy: asList(data.implemented_by),
    verifiedBy: asList(data.verified_by),
    artifacts: asList(data.artifacts),
    screenshots: parseScreenshots(filePath, data.screenshots),
    verifyCommands: asList(data.verify)
  };
}
