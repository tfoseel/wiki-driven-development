import { calculateImpact } from "./impact.js";
import type { WikiIndex } from "./index-wiki.js";

export function getVerifyCommands(index: WikiIndex, nodeId: string): string[] {
  const impact = calculateImpact(index, nodeId);
  const seen = new Set<string>();
  const commands: string[] = [];

  for (const id of impact.impactedNodes) {
    const node = index.byId.get(id);
    if (!node) continue;
    for (const command of node.verifyCommands) {
      if (seen.has(command)) continue;
      seen.add(command);
      commands.push(command);
    }
  }

  return commands;
}
