import path from "node:path";
import { loadWiki, type WikiNode, type WikiNodeType } from "@wdd/harness";

const TYPE_ORDER: WikiNodeType[] = ["root", "entity", "model", "action", "page", "flow", "policy", "qa", "term", "design"];
const TYPE_LABELS: Record<WikiNodeType, string> = {
  root: "개요",
  entity: "엔티티",
  model: "모델",
  action: "액션",
  page: "화면",
  flow: "플로우",
  policy: "정책",
  qa: "QA",
  term: "용어",
  design: "디자인"
};

export type WikiTypeTab = "all" | WikiNodeType;

export type WikiNodeTypeTab = {
  type: WikiTypeTab;
  label: string;
  count: number;
};

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

export function wikiHrefWithType(id: string, type: WikiTypeTab): string {
  const href = wikiHref(id);
  if (type === "all") return href;
  return `${href}?type=${type}`;
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

export function listWikiTypeTabs(nodes: WikiBrowserNode[]): WikiNodeTypeTab[] {
  const counts = new Map<WikiNodeType, number>();
  for (const node of nodes) counts.set(node.type, (counts.get(node.type) ?? 0) + 1);

  return [
    { type: "all", label: "전체", count: nodes.length },
    ...TYPE_ORDER.flatMap((type) => {
      const count = counts.get(type) ?? 0;
      return count ? [{ type, label: TYPE_LABELS[type], count }] : [];
    })
  ];
}

export function filterWikiNodesByType(nodes: WikiBrowserNode[], type: WikiTypeTab): WikiBrowserNode[] {
  if (type === "all") return nodes;
  return nodes.filter((node) => node.type === type);
}

export function parseWikiTypeTab(value: string | string[] | undefined): WikiTypeTab {
  const type = Array.isArray(value) ? value[0] : value;
  if (!type || type === "all") return "all";
  return TYPE_ORDER.includes(type as WikiNodeType) ? (type as WikiNodeType) : "all";
}

export function getWikiNode(id: string): WikiBrowserNode | undefined {
  const node = loadWiki(wikiRoot()).byId.get(id);
  return node ? toBrowserNode(node) : undefined;
}

export function getWikiNodeBySlug(slug?: string[]): WikiBrowserNode | undefined {
  const id = slug?.length ? slug.join("/") : "ROOT";
  return getWikiNode(id);
}
