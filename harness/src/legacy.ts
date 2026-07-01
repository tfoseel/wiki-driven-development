import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const legacyStatuses = [
  "code-ssot",
  "observed",
  "specified",
  "spec-frozen",
  "blind-implemented",
  "parity-reviewed",
  "wiki-ssot",
  "adapter",
  "retired"
] as const;

export type LegacyStatus = (typeof legacyStatuses)[number];

export interface LegacyFileEntry {
  path: string;
  status: LegacyStatus | string;
  coveredBy: string[];
  gaps: string[];
  evidence: string[];
  note?: string;
}

export interface LegacyMap {
  version: 1;
  purpose: string;
  statuses: Record<string, string>;
  files: LegacyFileEntry[];
}

export interface LegacyStatusUpdate {
  status: LegacyStatus;
  coveredBy?: string[];
  gaps?: string[];
  evidence?: string[];
  note?: string;
  force?: boolean;
}

const statusDescriptions: Record<LegacyStatus, string> = {
  "code-ssot": "Existing code currently defines behavior.",
  observed: "The running app and legacy code were observed; wiki candidates and evidence exist.",
  specified: "Visible and hidden behavior are specified in wiki, but the spec is not frozen.",
  "spec-frozen": "The wiki is frozen as the only implementation input for this slice.",
  "blind-implemented": "A wiki-only implementation exists without legacy-code access.",
  "parity-reviewed": "The wiki-derived implementation passed parity review against legacy evidence.",
  "wiki-ssot": "The wiki is the proven SSOT for this slice.",
  adapter: "A thin compatibility layer connects legacy entrypoints to wiki-derived implementation.",
  retired: "The legacy file or branch is no longer used."
};

const transitionOrder: LegacyStatus[] = [
  "code-ssot",
  "observed",
  "specified",
  "spec-frozen",
  "blind-implemented",
  "parity-reviewed",
  "wiki-ssot",
  "retired"
];

const statusIndex = (status: LegacyStatus): number => transitionOrder.indexOf(status);

const isAtLeast = (status: LegacyStatus, minimum: LegacyStatus): boolean => {
  const current = statusIndex(status);
  const target = statusIndex(minimum);
  return current >= 0 && target >= 0 && current >= target;
};

export function isWddManagedPath(filePath: string): boolean {
  const normalized = filePath.replaceAll("\\", "/");
  return (
    normalized === "AGENTS.md" ||
    normalized === "legacy-map.json" ||
    normalized === ".github/ISSUE_TEMPLATE/wdd-change.md" ||
    normalized === ".github/PULL_REQUEST_TEMPLATE.md" ||
    normalized.startsWith("wiki/") ||
    normalized.startsWith("harness/")
  );
}

export function createLegacyMapFromFiles(files: string[]): LegacyMap {
  const entries = Array.from(new Set(files.map((file) => file.replaceAll("\\", "/"))))
    .filter((file) => file && !isWddManagedPath(file))
    .sort()
    .map((file): LegacyFileEntry => ({ path: file, status: "code-ssot", coveredBy: [], gaps: [], evidence: [] }));

  return {
    version: 1,
    purpose: "Track migration from code-SSOT legacy files to wiki-SSOT slices.",
    statuses: { ...statusDescriptions },
    files: entries
  };
}

export function canTransitionLegacyStatus(from: LegacyStatus, to: LegacyStatus): boolean {
  if (from === to) return true;
  if (to === "adapter") return from === "wiki-ssot" || from === "parity-reviewed";
  if (from === "adapter") return to === "retired";

  const fromIndex = transitionOrder.indexOf(from);
  const toIndex = transitionOrder.indexOf(to);
  return fromIndex >= 0 && toIndex === fromIndex + 1;
}

const mergeUnique = (current: string[], additions: string[] | undefined): string[] =>
  Array.from(new Set([...current, ...(additions ?? [])].filter(Boolean)));

export function markLegacyFileStatus(map: LegacyMap, filePath: string, update: LegacyStatusUpdate): LegacyMap {
  const normalized = filePath.replaceAll("\\", "/");
  if (isWddManagedPath(normalized)) {
    throw new Error(`${normalized} is a WDD-managed path and cannot be tracked as legacy.`);
  }

  if (!legacyStatuses.includes(update.status)) {
    throw new Error(`Unknown legacy status: ${update.status}`);
  }

  const files = [...map.files];
  const existing = files.find((file) => file.path.replaceAll("\\", "/") === normalized);
  const current: LegacyFileEntry = existing ?? {
    path: normalized,
    status: "code-ssot",
    coveredBy: [],
    gaps: [],
    evidence: []
  };

  if (!legacyStatuses.includes(current.status as LegacyStatus)) {
    throw new Error(`${normalized} has unknown current legacy status: ${current.status}`);
  }

  const currentStatus = current.status as LegacyStatus;
  if (!update.force && !canTransitionLegacyStatus(currentStatus, update.status)) {
    throw new Error(`Cannot move ${normalized} from ${currentStatus} to ${update.status}.`);
  }

  const next: LegacyFileEntry = {
    ...current,
    status: update.status,
    coveredBy: mergeUnique(current.coveredBy, update.coveredBy),
    gaps: update.gaps === undefined ? current.gaps : Array.from(new Set(update.gaps.filter(Boolean))),
    evidence: mergeUnique(current.evidence, update.evidence),
    note: update.note ?? current.note
  };

  if (isAtLeast(next.status as LegacyStatus, "observed") && !next.evidence.length) {
    throw new Error(`${normalized} must include evidence before ${next.status}.`);
  }

  if (isAtLeast(next.status as LegacyStatus, "specified") && !next.coveredBy.length) {
    throw new Error(`${normalized} must name coveredBy wiki nodes before ${next.status}.`);
  }

  if (isAtLeast(next.status as LegacyStatus, "specified") && next.gaps.length) {
    throw new Error(`${normalized} cannot be ${next.status} while unresolved gaps remain.`);
  }

  return {
    ...map,
    files: [...files.filter((file) => file.path.replaceAll("\\", "/") !== normalized), next].sort((a, b) => a.path.localeCompare(b.path))
  };
}

export function validateLegacyMap(map: LegacyMap): string[] {
  const issues: string[] = [];
  const knownStatuses = new Set(legacyStatuses);
  const seenPaths = new Set<string>();

  if (map.version !== 1) issues.push("legacy-map.json version must be 1.");
  if (!Array.isArray(map.files)) issues.push("legacy-map.json files must be an array.");

  for (const file of map.files ?? []) {
    const normalized = file.path.replaceAll("\\", "/");
    if (seenPaths.has(normalized)) issues.push(`${normalized} is duplicated in legacy-map.json.`);
    seenPaths.add(normalized);

    if (normalized.startsWith("wiki/")) {
      issues.push(`${normalized} must not be listed as a legacy file; wiki/ is the SSOT surface.`);
    } else if (normalized.startsWith("harness/")) {
      issues.push(`${normalized} must not be listed as a legacy file; harness/ is WDD system surface.`);
    } else if (isWddManagedPath(normalized)) {
      issues.push(`${normalized} must not be listed as a legacy file; it is WDD system surface.`);
    }

    if (!knownStatuses.has(file.status as LegacyStatus)) {
      issues.push(`${normalized} has unknown legacy status: ${file.status}`);
    }

    if (!knownStatuses.has(file.status as LegacyStatus)) {
      continue;
    }

    const status = file.status as LegacyStatus;
    if (isAtLeast(status, "observed") && !file.evidence.length) {
      issues.push(`${normalized} must include evidence before ${status}.`);
    }

    if (isAtLeast(status, "specified") && !file.coveredBy.length) {
      issues.push(`${normalized} must name coveredBy wiki nodes before ${status}.`);
    }

    if (isAtLeast(status, "specified") && file.gaps.length) {
      issues.push(`${normalized} cannot be ${status} while unresolved gaps remain.`);
    }
  }

  return issues;
}

export function readLegacyMap(mapPath: string): LegacyMap {
  return JSON.parse(fs.readFileSync(mapPath, "utf8")) as LegacyMap;
}

export function writeLegacyMap(mapPath: string, map: LegacyMap): void {
  fs.writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`);
}

export function listGitTrackedFiles(repoRoot: string): string[] {
  return execFileSync("git", ["-C", repoRoot, "ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean);
}

export function resolveLegacyMapPath(repoRoot: string, mapPath = "legacy-map.json"): string {
  return path.isAbsolute(mapPath) ? mapPath : path.resolve(repoRoot, mapPath);
}

export function summarizeLegacyMap(map: LegacyMap): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const status of legacyStatuses) summary[status] = 0;
  for (const file of map.files) summary[file.status] = (summary[file.status] ?? 0) + 1;
  return summary;
}
