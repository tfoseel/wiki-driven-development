import type { WikiIndex } from "./index-wiki.js";

export interface ImpactResult {
  nodeId: string;
  upstream: string[];
  downstream: string[];
  impactedNodes: string[];
  codeFiles: string[];
}

const walk = (edges: Map<string, string[]>, start: string): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  const queue = [...(edges.get(start) ?? [])];
  while (queue.length) {
    const next = queue.shift();
    if (!next || seen.has(next)) continue;
    seen.add(next);
    out.push(next);
    queue.push(...(edges.get(next) ?? []));
  }
  return out;
};

export function calculateImpact(index: WikiIndex, nodeId: string): ImpactResult {
  const node = index.byId.get(nodeId);
  if (!node) throw new Error(`Unknown node: ${nodeId}`);

  const upstream = walk(index.dependencies, nodeId);
  const downstream = walk(index.dependents, nodeId);
  const impactedNodes = [nodeId, ...downstream];
  const codeFiles = new Set<string>();

  for (const id of impactedNodes) {
    const impacted = index.byId.get(id);
    if (!impacted) continue;
    for (const file of [...impacted.implementedBy, ...impacted.verifiedBy, ...impacted.artifacts]) {
      codeFiles.add(file);
    }
  }

  return { nodeId, upstream, downstream, impactedNodes, codeFiles: [...codeFiles].sort() };
}
