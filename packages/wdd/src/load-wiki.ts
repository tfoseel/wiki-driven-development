import fs from "node:fs";
import path from "node:path";
import { buildWikiIndex, type WikiIndex } from "./index-wiki.js";
import { parseWikiMarkdown } from "./parse.js";

export function findMarkdownFiles(root: string): string[] {
  if (!fs.existsSync(root)) throw new Error(`Wiki root does not exist: ${root}`);
  const out: string[] = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...findMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(fullPath);
  }
  return out.sort();
}

export function loadWiki(root: string): WikiIndex {
  const files = findMarkdownFiles(root);
  const nodes = files.map((file) => parseWikiMarkdown(file, fs.readFileSync(file, "utf8")));
  return buildWikiIndex(nodes);
}
