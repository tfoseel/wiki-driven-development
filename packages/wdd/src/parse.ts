import matter from "gray-matter";
import type { WikiNode, WikiNodeType } from "./node.js";

const NODE_TYPES = new Set<WikiNodeType>([
  "entity",
  "model",
  "action",
  "page",
  "flow",
  "policy",
  "qa",
  "term",
  "design",
  "root"
]);

const asList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
};

export function parseWikiMarkdown(filePath: string, raw: string): WikiNode {
  const parsed = matter(raw);
  const data = parsed.data;
  if (!data.id) throw new Error(`${filePath}: missing id`);
  if (!data.type) throw new Error(`${filePath}: missing type`);
  if (!NODE_TYPES.has(data.type)) throw new Error(`${filePath}: invalid type ${data.type}`);
  if (!data.title) throw new Error(`${filePath}: missing title`);

  return {
    id: String(data.id),
    type: data.type,
    title: String(data.title),
    summary: data.summary ? String(data.summary) : undefined,
    filePath,
    body: parsed.content,
    dependsOn: asList(data.depends_on),
    implementedBy: asList(data.implemented_by),
    verifiedBy: asList(data.verified_by),
    artifacts: asList(data.artifacts),
    verifyCommands: asList(data.verify)
  };
}
