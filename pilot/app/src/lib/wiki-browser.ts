import path from "node:path";
import { loadWiki, type WikiNode, type WikiNodeType } from "@wdd/harness";

const TYPE_ORDER: WikiNodeType[] = ["root", "entity", "model", "action", "page", "flow", "policy", "qa", "term", "design"];

export type WikiBrowserNode = {
  id: string;
  type: WikiNodeType;
  title: string;
  summary?: string;
  body: string;
  href: string;
  filePath: string;
  dependencies: string[];
  implementationRefs: string[];
  verificationRefs: string[];
  artifactRefs: string[];
};

function repoRoot(): string {
  return path.resolve(process.cwd(), "../..");
}

function wikiRoot(): string {
  return path.resolve(process.cwd(), "../wiki");
}

export function wikiHref(id: string): string {
  if (id === "ROOT") return "/wiki";
  return `/wiki/${id.split("/").map(encodeURIComponent).join("/")}`;
}

function toBrowserNode(node: WikiNode): WikiBrowserNode {
  return {
    id: node.id,
    type: node.type,
    title: node.title,
    summary: node.summary,
    body: node.body.trim(),
    href: wikiHref(node.id),
    filePath: path.relative(repoRoot(), node.filePath),
    dependencies: node.dependsOn,
    implementationRefs: node.implementedBy,
    verificationRefs: node.verifiedBy,
    artifactRefs: node.artifacts
  };
}

function compareNodes(a: WikiBrowserNode, b: WikiBrowserNode): number {
  if (a.id === "ROOT") return -1;
  if (b.id === "ROOT") return 1;
  const typeDelta = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
  return typeDelta || a.id.localeCompare(b.id);
}

export function listWikiNodes(): WikiBrowserNode[] {
  return loadWiki(wikiRoot()).nodes.map(toBrowserNode).sort(compareNodes);
}

export function getWikiNode(id: string): WikiBrowserNode | undefined {
  const node = loadWiki(wikiRoot()).byId.get(id);
  return node ? toBrowserNode(node) : undefined;
}

export function getWikiNodeBySlug(slug?: string[]): WikiBrowserNode | undefined {
  const id = slug?.length ? slug.join("/") : "ROOT";
  return getWikiNode(id);
}
