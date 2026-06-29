import { calculateImpact } from "./impact.js";
import { loadWiki } from "./load-wiki.js";

const [, , command = "help", ...args] = process.argv;

if (command === "help") {
  console.log(`wdd commands:
  index <wikiRoot>
  impact <wikiRoot> <nodeId>
  session <wikiRoot> <nodeId>
  drift <wikiRoot>
  verify <wikiRoot> <nodeId>`);
} else if (command === "index") {
  const [wikiRoot] = args;
  if (!wikiRoot) throw new Error("Usage: wdd index <wikiRoot>");
  const index = loadWiki(wikiRoot);
  console.log(`nodes: ${index.nodes.length}`);
  for (const node of index.nodes) console.log(`- ${node.id} (${node.type})`);
} else if (command === "impact") {
  const [wikiRoot, nodeId] = args;
  if (!wikiRoot || !nodeId) throw new Error("Usage: wdd impact <wikiRoot> <nodeId>");
  const index = loadWiki(wikiRoot);
  const impact = calculateImpact(index, nodeId);
  console.log(impact.nodeId);
  console.log("upstream:");
  for (const id of impact.upstream) console.log(`  - ${id}`);
  console.log("downstream:");
  for (const id of impact.downstream) console.log(`  - ${id}`);
  console.log("code:");
  for (const file of impact.codeFiles) console.log(`  - ${file}`);
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}
