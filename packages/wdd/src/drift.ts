import fs from "node:fs";
import path from "node:path";
import type { WikiIndex } from "./index-wiki.js";
import type { WikiNode } from "./node.js";

export type CodeReferenceField = "implemented_by" | "verified_by" | "artifacts";

export interface MissingCodeReference {
  nodeId: string;
  field: CodeReferenceField;
  file: string;
}

const referencesFor = (node: WikiNode): Array<{ field: CodeReferenceField; file: string }> => [
  ...node.implementedBy.map((file) => ({ field: "implemented_by" as const, file })),
  ...node.verifiedBy.map((file) => ({ field: "verified_by" as const, file })),
  ...node.artifacts.map((file) => ({ field: "artifacts" as const, file }))
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
