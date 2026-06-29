import { calculateImpact } from "./impact.js";
import { loadWiki } from "./load-wiki.js";
import { formatSessionContext } from "./session.js";
import { findMissingCodeReferences } from "./drift.js";
import { getVerifyCommands } from "./verify.js";
import { resolveCliPath } from "./cli-paths.js";

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
  const index = loadWiki(resolveCliPath(wikiRoot));
  console.log(`nodes: ${index.nodes.length}`);
  for (const node of index.nodes) console.log(`- ${node.id} (${node.type})`);
} else if (command === "impact") {
  const [wikiRoot, nodeId] = args;
  if (!wikiRoot || !nodeId) throw new Error("Usage: wdd impact <wikiRoot> <nodeId>");
  const index = loadWiki(resolveCliPath(wikiRoot));
  const impact = calculateImpact(index, nodeId);
  console.log(impact.nodeId);
  console.log("upstream:");
  for (const id of impact.upstream) console.log(`  - ${id}`);
  console.log("downstream:");
  for (const id of impact.downstream) console.log(`  - ${id}`);
  console.log("code:");
  for (const file of impact.codeFiles) console.log(`  - ${file}`);
} else if (command === "session") {
  const [wikiRoot, nodeId] = args;
  if (!wikiRoot || !nodeId) throw new Error("Usage: wdd session <wikiRoot> <nodeId>");
  console.log(formatSessionContext(loadWiki(resolveCliPath(wikiRoot)), nodeId));
} else if (command === "drift") {
  const [wikiRoot, repoRoot = process.cwd()] = args;
  if (!wikiRoot) throw new Error("Usage: wdd drift <wikiRoot> [repoRoot]");
  const missing = findMissingCodeReferences(loadWiki(resolveCliPath(wikiRoot)), resolveCliPath(repoRoot));
  if (!missing.length) {
    console.log("No missing code references.");
  } else {
    console.log("missing code references:");
    for (const item of missing) {
      console.log(`  - ${item.nodeId} ${item.field}: ${item.file}`);
    }
  }
} else if (command === "verify") {
  const [wikiRoot, nodeId] = args;
  if (!wikiRoot || !nodeId) throw new Error("Usage: wdd verify <wikiRoot> <nodeId>");
  const commands = getVerifyCommands(loadWiki(resolveCliPath(wikiRoot)), nodeId);
  if (!commands.length) {
    console.log("No verify commands declared.");
  } else {
    console.log("verify commands:");
    for (const verifyCommand of commands) console.log(`  - ${verifyCommand}`);
  }
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}
