import { calculateImpact } from "./impact.js";
import type { WikiIndex } from "./index-wiki.js";
import type { WikiNode } from "./node.js";

const nodeLine = (node: WikiNode): string => `- \`${node.id}\` — ${node.title}`;

const unique = (items: string[]): string[] => [...new Set(items)].sort();

export function formatSessionContext(index: WikiIndex, nodeId: string): string {
  const node = index.byId.get(nodeId);
  if (!node) throw new Error(`Unknown node: ${nodeId}`);

  const impact = calculateImpact(index, nodeId);
  const upstreamNodes = impact.upstream.map((id) => index.byId.get(id)).filter((item): item is WikiNode => !!item);
  const downstreamNodes = impact.downstream.map((id) => index.byId.get(id)).filter((item): item is WikiNode => !!item);
  const impactedNodes = impact.impactedNodes.map((id) => index.byId.get(id)).filter((item): item is WikiNode => !!item);
  const verifyCommands = unique(impactedNodes.flatMap((item) => item.verifyCommands));

  return [
    `# WDD Session: ${node.title}`,
    "",
    "## Cadence",
    "",
    "1. Edit the wiki first.",
    "2. Run impact and read impacted wiki nodes.",
    "3. Edit only referenced or owned code files.",
    "4. Run verify and drift before claiming completion.",
    "",
    "## Selected Node",
    "",
    nodeLine(node),
    "",
    "## Upstream Dependencies",
    "",
    ...(upstreamNodes.length ? upstreamNodes.map(nodeLine) : ["- none"]),
    "",
    "## Downstream Dependents",
    "",
    ...(downstreamNodes.length ? downstreamNodes.map(nodeLine) : ["- none"]),
    "",
    "## Referenced Code Files",
    "",
    ...(impact.codeFiles.length ? impact.codeFiles.map((file) => `- \`${file}\``) : ["- none"]),
    "",
    "## Verification Commands",
    "",
    ...(verifyCommands.length ? verifyCommands.map((command) => `- \`${command}\``) : ["- none"]),
    "",
    "## Wiki Body",
    "",
    node.body.trim() || "_No body content._",
    ""
  ].join("\n");
}
