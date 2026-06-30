import type { WikiNode } from "./node.js";

export interface WikiIndex {
  nodes: WikiNode[];
  byId: Map<string, WikiNode>;
  dependencies: Map<string, string[]>;
  dependents: Map<string, string[]>;
}

export function buildWikiIndex(nodes: WikiNode[]): WikiIndex {
  const byId = new Map<string, WikiNode>();
  for (const node of nodes) {
    if (byId.has(node.id)) throw new Error(`Duplicate node id: ${node.id}`);
    byId.set(node.id, node);
  }

  const dependencies = new Map<string, string[]>();
  const dependents = new Map<string, string[]>();

  for (const node of nodes) {
    dependencies.set(node.id, node.dependsOn);
    for (const dep of node.dependsOn) {
      if (!byId.has(dep)) throw new Error(`${node.id}: dangling dependency ${dep}`);
      const current = dependents.get(dep) ?? [];
      current.push(node.id);
      dependents.set(dep, current);
    }
  }

  return { nodes, byId, dependencies, dependents };
}
