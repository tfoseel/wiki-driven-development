import fs from "node:fs";
import { calculateImpact } from "./impact.js";
import { loadWiki } from "./load-wiki.js";
import { formatSessionContext } from "./session.js";
import { findMissingCodeReferences } from "./drift.js";
import { getVerifyCommands } from "./verify.js";
import { resolveCliPath } from "./cli-paths.js";
import { findWorkflowAttention, formatWorkflowStatus } from "./workflow.js";
import { collectScreenshotTargets } from "./screenshots.js";
import { collectFlowTreeTargets } from "./flow-trees.js";
import { markWikiStatus, type WikiStatusUpdate } from "./mark.js";
import { findWddConfig, resolveWddProject } from "./config.js";
import { checkReady, formatReadyReport } from "./ready.js";
import {
  createLegacyMapFromFiles,
  listGitTrackedFiles,
  markLegacyFileStatus,
  readLegacyMap,
  resolveLegacyMapPath,
  summarizeLegacyMap,
  validateLegacyMap,
  writeLegacyMap
} from "./legacy.js";

const [, , command = "help", ...args] = process.argv;

const readFlag = (items: string[], name: string): string | undefined => {
  const index = items.indexOf(name);
  if (index < 0) return undefined;
  const value = items[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
  return value;
};

const hasFlag = (items: string[], name: string): boolean => items.includes(name);

const readRepeatedFlag = (items: string[], name: string): string[] => {
  const values: string[] = [];
  for (let index = 0; index < items.length; index += 1) {
    if (items[index] !== name) continue;
    const value = items[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}`);
    values.push(value);
  }
  return values;
};

const positionalArgs = (items: string[], valueFlags: string[], booleanFlags: string[] = []): string[] => {
  const values: string[] = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (valueFlags.includes(item)) {
      index += 1;
      continue;
    }
    if (booleanFlags.includes(item)) continue;
    values.push(item);
  }
  return values;
};

if (command === "help") {
  console.log(`wdd commands:
  index <wikiRoot>
  impact <wikiRoot> <nodeId>
  session <wikiRoot> <nodeId>
  drift <wikiRoot>
  verify <wikiRoot> <nodeId>
  status <wikiRoot> [nodeId]
  mark <wikiRoot> <nodeId> --phase <phase> --code <status> --verification <status> [--note <note>] [--clear-note] [--with-impact]
  screenshots <wikiRoot> [--json]
  flow-trees <wikiRoot> [repoRoot] [--json]
  legacy init [repoRoot] [mapPath]
  legacy status [repoRoot] [mapPath] [--json]
  legacy mark <filePath> --status <status> [repoRoot] [mapPath] [--covered-by <nodeId>] [--evidence <path>] [--gap <gap>] [--clear-gaps] [--note <note>] [--force]
  ready [wikiRoot] [repoRoot]`);
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
} else if (command === "status") {
  const [wikiRoot, nodeId] = args;
  if (!wikiRoot) throw new Error("Usage: wdd status <wikiRoot> [nodeId]");
  const index = loadWiki(resolveCliPath(wikiRoot));
  console.log(formatWorkflowStatus(index, nodeId));
  if (findWorkflowAttention(index, nodeId).length) process.exitCode = 1;
} else if (command === "mark") {
  const [wikiRoot, nodeId, ...markArgs] = args;
  if (!wikiRoot || !nodeId) {
    throw new Error(
      "Usage: wdd mark <wikiRoot> <nodeId> --phase <phase> --code <status> --verification <status> [--note <note>] [--clear-note] [--with-impact]"
    );
  }

  const update: WikiStatusUpdate = {
    phase: readFlag(markArgs, "--phase") as WikiStatusUpdate["phase"],
    code: readFlag(markArgs, "--code") as WikiStatusUpdate["code"],
    verification: readFlag(markArgs, "--verification") as WikiStatusUpdate["verification"],
    note: readFlag(markArgs, "--note"),
    clearNote: hasFlag(markArgs, "--clear-note")
  };

  if (!update.phase && !update.code && !update.verification && update.note === undefined && !update.clearNote) {
    throw new Error("wdd mark requires at least one status update flag.");
  }

  const results = markWikiStatus(loadWiki(resolveCliPath(wikiRoot)), nodeId, update, {
    withImpact: hasFlag(markArgs, "--with-impact")
  });
  console.log("marked wiki status:");
  for (const result of results) {
    console.log(
      `  - ${result.nodeId}: ${result.status.phase}, code=${result.status.code}, verification=${result.status.verification}`
    );
  }
} else if (command === "screenshots") {
  const [wikiRoot, format] = args;
  if (!wikiRoot) throw new Error("Usage: wdd screenshots <wikiRoot> [--json]");
  const targets = collectScreenshotTargets(loadWiki(resolveCliPath(wikiRoot)));
  if (format === "--json") {
    console.log(JSON.stringify(targets, null, 2));
  } else if (!targets.length) {
    console.log("No screenshot targets declared.");
  } else {
    console.log("screenshot targets:");
    for (const target of targets) console.log(`  - ${target.nodeId} ${target.route} -> ${target.path}`);
  }
} else if (command === "flow-trees") {
  const [wikiRootArg, repoRootOrFormat, maybeFormat] = args;
  if (!wikiRootArg) throw new Error("Usage: wdd flow-trees <wikiRoot> [repoRoot] [--json]");
  const format = repoRootOrFormat === "--json" ? repoRootOrFormat : maybeFormat;
  const repoRoot = repoRootOrFormat && repoRootOrFormat !== "--json" ? resolveCliPath(repoRootOrFormat) : process.cwd();
  const targets = collectFlowTreeTargets(loadWiki(resolveCliPath(wikiRootArg)), repoRoot);
  if (format === "--json") {
    console.log(JSON.stringify(targets, null, 2));
  } else if (!targets.length) {
    console.log("No flow tree targets declared.");
  } else {
    console.log("flow tree targets:");
    for (const target of targets) console.log(`  - ${target.nodeId} -> ${target.path}`);
  }
} else if (command === "legacy") {
  const format = hasFlag(args, "--json") ? "--json" : undefined;
  const legacyArgs = args.filter((arg) => arg !== "--json");
  const [legacyCommand = "status", ...legacyRest] = legacyArgs;
  const readMapContext = (items: string[]): { repoRoot: string; mapPath: string } => {
    const [repoRootArg = process.cwd(), mapPathArg] = items;
    const repoRoot = resolveCliPath(repoRootArg);
    return { repoRoot, mapPath: resolveLegacyMapPath(repoRoot, mapPathArg) };
  };

  if (legacyCommand === "init") {
    const { repoRoot, mapPath } = readMapContext(legacyRest);
    const map = createLegacyMapFromFiles(listGitTrackedFiles(repoRoot));
    writeLegacyMap(mapPath, map);
    console.log(`legacy-map initialized: ${mapPath}`);
    console.log(`files: ${map.files.length}`);
  } else if (legacyCommand === "status") {
    const { mapPath } = readMapContext(legacyRest);
    if (!fs.existsSync(mapPath)) throw new Error(`Missing legacy map: ${mapPath}`);
    const map = readLegacyMap(mapPath);
    const issues = validateLegacyMap(map);
    const summary = summarizeLegacyMap(map);
    if (format === "--json") {
      console.log(JSON.stringify({ ok: issues.length === 0, summary, issues }, null, 2));
    } else {
      console.log("legacy-map status:");
      console.log(`  ok: ${issues.length === 0 ? "yes" : "no"}`);
      console.log(`  files: ${map.files.length}`);
      for (const [status, count] of Object.entries(summary)) {
        if (count) console.log(`  ${status}: ${count}`);
      }
      for (const issue of issues) console.log(`  - ${issue}`);
    }
    if (issues.length) process.exitCode = 1;
  } else if (legacyCommand === "mark") {
    const positions = positionalArgs(legacyRest, ["--status", "--covered-by", "--evidence", "--gap", "--note"], ["--force", "--clear-gaps"]);
    const [filePath, ...contextArgs] = positions;
    const status = readFlag(legacyRest, "--status");
    if (!filePath || !status) {
      throw new Error(
        "Usage: wdd legacy mark <filePath> --status <status> [repoRoot] [mapPath] [--covered-by <nodeId>] [--evidence <path>] [--gap <gap>] [--clear-gaps] [--note <note>] [--force]"
      );
    }
    const { mapPath } = readMapContext(contextArgs);
    if (!fs.existsSync(mapPath)) throw new Error(`Missing legacy map: ${mapPath}`);
    const map = markLegacyFileStatus(readLegacyMap(mapPath), filePath, {
      status: status as Parameters<typeof markLegacyFileStatus>[2]["status"],
      coveredBy: readRepeatedFlag(legacyRest, "--covered-by"),
      evidence: readRepeatedFlag(legacyRest, "--evidence"),
      gaps: hasFlag(legacyRest, "--clear-gaps") ? [] : legacyRest.includes("--gap") ? readRepeatedFlag(legacyRest, "--gap") : undefined,
      note: readFlag(legacyRest, "--note"),
      force: hasFlag(legacyRest, "--force")
    });
    writeLegacyMap(mapPath, map);
    const entry = map.files.find((file) => file.path.replaceAll("\\", "/") === filePath.replaceAll("\\", "/"));
    console.log(`legacy-map marked: ${filePath} -> ${entry?.status ?? status}`);
  } else {
    throw new Error(
      "Usage: wdd legacy init [repoRoot] [mapPath] | wdd legacy status [repoRoot] [mapPath] [--json] | wdd legacy mark <filePath> --status <status> [repoRoot] [mapPath]"
    );
  }
} else if (command === "ready") {
  const [wikiRootArg, repoRootArg] = args;
  const configPath = !wikiRootArg ? findWddConfig() : undefined;
  const project = configPath ? resolveWddProject(configPath) : undefined;
  const wikiRoot = wikiRootArg ? resolveCliPath(wikiRootArg) : project?.wikiRoot;
  const repoRoot = repoRootArg ? resolveCliPath(repoRootArg) : project?.repoRoot ?? process.cwd();
  if (!wikiRoot) throw new Error("Usage: wdd ready [wikiRoot] [repoRoot]");
  const result = checkReady(loadWiki(wikiRoot), repoRoot);
  console.log(formatReadyReport(result));
  if (!result.ok) process.exitCode = 1;
} else {
  console.error(`Unknown command: ${command}`);
  process.exitCode = 1;
}
