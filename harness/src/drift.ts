import fs from "node:fs";
import path from "node:path";
import type { WikiIndex } from "./index-wiki.js";
import type { WikiNode } from "./node.js";

export type CodeReferenceField = "implemented_by" | "verified_by" | "artifacts" | "assets" | "screenshots";

export interface MissingCodeReference {
  nodeId: string;
  field: CodeReferenceField;
  file: string;
}

const isLocalReference = (file: string): boolean => !/^[a-z][a-z0-9+.-]*:/i.test(file) && !file.startsWith("//");

const referencesFor = (node: WikiNode): Array<{ field: CodeReferenceField; file: string }> => [
  ...node.implementedBy.map((file) => ({ field: "implemented_by" as const, file })),
  ...node.verifiedBy.map((file) => ({ field: "verified_by" as const, file })),
  ...node.artifacts.map((file) => ({ field: "artifacts" as const, file })),
  ...node.assets.filter((asset) => isLocalReference(asset.path)).map((asset) => ({ field: "assets" as const, file: asset.path })),
  ...node.screenshots.map((screenshot) => ({ field: "screenshots" as const, file: screenshot.path }))
];

export function findMissingCodeReferences(index: WikiIndex, repoRoot: string): MissingCodeReference[] {
  const missing: MissingCodeReference[] = [];
  for (const node of index.nodes) {
    for (const ref of referencesFor(node)) {
      if (!fs.existsSync(path.resolve(repoRoot, ref.file))) {
        missing.push({ nodeId: node.id, field: ref.field, file: ref.file });
      }
    }
  }
  return missing;
}
