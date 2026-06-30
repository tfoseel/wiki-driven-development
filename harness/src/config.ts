import fs from "node:fs";
import path from "node:path";

export interface WddConfig {
  wikiRoot: string;
  repoRoot?: string;
  appRoot?: string;
  ready?: {
    commands?: string[];
  };
}

export interface ResolvedWddProject {
  configPath: string;
  projectRoot: string;
  wikiRoot: string;
  repoRoot: string;
  appRoot?: string;
  readyCommands: string[];
}

export function loadWddConfig(configPath: string, raw = fs.readFileSync(configPath, "utf8")): WddConfig {
  const config = JSON.parse(raw) as WddConfig;
  if (!config.wikiRoot) throw new Error(`${configPath}: missing wikiRoot`);
  return {
    wikiRoot: String(config.wikiRoot),
    repoRoot: config.repoRoot ? String(config.repoRoot) : undefined,
    appRoot: config.appRoot ? String(config.appRoot) : undefined,
    ready: {
      commands: Array.isArray(config.ready?.commands) ? config.ready.commands.map(String) : []
    }
  };
}

export function resolveWddProject(configPath: string, config = loadWddConfig(configPath)): ResolvedWddProject {
  const projectRoot = path.dirname(configPath);
  const resolveProjectPath = (value: string) => (path.isAbsolute(value) ? value : path.resolve(projectRoot, value));

  return {
    configPath,
    projectRoot,
    wikiRoot: resolveProjectPath(config.wikiRoot),
    repoRoot: resolveProjectPath(config.repoRoot ?? "."),
    appRoot: config.appRoot ? resolveProjectPath(config.appRoot) : undefined,
    readyCommands: config.ready?.commands ?? []
  };
}

export function findWddConfig(start = process.env.INIT_CWD || process.cwd()): string | undefined {
  let current = path.resolve(start);
  while (true) {
    const candidates = [path.join(current, "wdd.config.json"), path.join(current, "harness", "wdd.config.json")];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) return candidate;
    }
    const parent = path.dirname(current);
    if (parent === current) return undefined;
    current = parent;
  }
}
