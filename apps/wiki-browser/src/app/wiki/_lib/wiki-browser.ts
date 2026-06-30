import fs from "node:fs";
import path from "node:path";
import {
  calculateImpact,
  loadWiki,
  type WddStatus,
  type WikiIndex,
  type WikiNode,
  type WikiNodeType,
  type WikiScreenshot
} from "@wdd/harness";

const PRODUCT_TYPE_ORDER: WikiNodeType[] = ["root", "entity", "model", "action", "page", "flow", "policy", "qa", "term", "design"];
const TYPE_ORDER: WikiNodeType[] = PRODUCT_TYPE_ORDER;
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
  wddStatus: WddStatus;
  dependencies: string[];
  implementationRefs: string[];
  verificationRefs: string[];
  verifyCommands: string[];
  artifactRefs: string[];
  screenshots: WikiBrowserScreenshot[];
  impact: WikiBrowserImpact;
  nextActionLabel: string;
};

export type WikiBrowserScreenshot = WikiScreenshot & {
  src?: string;
};

export type WikiBrowserImpact = {
  upstreamNodeIds: string[];
  downstreamNodeIds: string[];
  impactedNodeIds: string[];
  codeFiles: string[];
};

function repoRoot(): string {
  const configured = process.env.WDD_REPO_ROOT?.trim();
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), configured || "../..");
}

function wikiRoot(): string {
  const configured = process.env.WDD_WIKI_ROOT?.trim();
  return configured ? path.resolve(/* turbopackIgnore: true */ process.cwd(), configured) : path.join(repoRoot(), "pilot/wiki");
}

function screenshotSrc(screenshotPath: string): string | undefined {
  const screenshotRoot = path.join(wikiRoot(), "assets/screenshots");
  const prefix = "pilot/wiki/assets/screenshots/";
  if (!screenshotPath.startsWith(prefix)) return undefined;
  const relativePath = screenshotPath.slice(prefix.length);
  const fullPath = path.resolve(screenshotRoot, relativePath);
  if (!fullPath.startsWith(`${screenshotRoot}${path.sep}`)) return undefined;
  if (!fs.existsSync(fullPath)) return undefined;
  const buffer = fs.readFileSync(fullPath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export function wikiHref(id: string): string {
  if (id === "ROOT") return "/wiki";
  return `/wiki/${id.split("/").map(encodeURIComponent).join("/")}`;
}

export function wikiHrefWithType(id: string, type: WikiTypeTab): string {
  void id;
  return type === "all" ? "/wiki" : `/wiki/type/${type}`;
}

function nextActionLabel(status: WddStatus): string {
  if (status.phase === "blocked") return "차단 해소";
  if (status.phase === "wiki") return "위키 수정";
  if (status.phase === "coding" || status.code === "pending") return "코드 반영";
  if (status.phase === "verification" || status.verification === "pending") return "검증";
  if (status.verification === "failed") return "검증 실패 해결";
  return "변경 없음";
}

function toBrowserNode(index: WikiIndex, node: WikiNode): WikiBrowserNode {
  const impact = calculateImpact(index, node.id);

  return {
    id: node.id,
    type: node.type,
    title: node.title,
    summary: node.summary,
    body: node.body.trim(),
    href: wikiHref(node.id),
    filePath: path.relative(repoRoot(), node.filePath),
    wddStatus: node.wddStatus,
    dependencies: node.dependsOn,
    implementationRefs: node.implementedBy,
    verificationRefs: node.verifiedBy,
    verifyCommands: node.verifyCommands,
    artifactRefs: node.artifacts,
    screenshots: node.screenshots.map((screenshot) => ({
      ...screenshot,
      src: screenshotSrc(screenshot.path)
    })),
    impact: {
      upstreamNodeIds: impact.upstream,
      downstreamNodeIds: impact.downstream,
      impactedNodeIds: impact.impactedNodes,
      codeFiles: impact.codeFiles
    },
    nextActionLabel: nextActionLabel(node.wddStatus)
  };
}

function compareNodes(a: WikiBrowserNode, b: WikiBrowserNode): number {
  if (a.id === "ROOT") return -1;
  if (b.id === "ROOT") return 1;
  const typeDelta = TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type);
  return typeDelta || a.id.localeCompare(b.id);
}

export function listWikiNodes(): WikiBrowserNode[] {
  const index = loadWiki(wikiRoot());
  return index.nodes.map((node) => toBrowserNode(index, node)).sort(compareNodes);
}

export function listWikiTypeTabs(nodes: WikiBrowserNode[]): WikiNodeTypeTab[] {
  const counts = new Map<WikiNodeType, number>();
  for (const node of nodes) counts.set(node.type, (counts.get(node.type) ?? 0) + 1);

  return [
    { type: "all", label: "전체", count: nodes.length },
    ...PRODUCT_TYPE_ORDER.flatMap((type) => {
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

export function parseWikiNodeType(value: string | undefined): WikiNodeType | undefined {
  return value && TYPE_ORDER.includes(value as WikiNodeType) ? (value as WikiNodeType) : undefined;
}

export function listStaticWikiTypes(): WikiNodeType[] {
  const availableTypes = new Set(listWikiNodes().map((node) => node.type));
  return PRODUCT_TYPE_ORDER.filter((type) => availableTypes.has(type));
}

export function listStaticWikiParams(): Array<{ slug?: string[] }> {
  return listWikiNodes().map((node) => ({
    slug: node.id === "ROOT" ? [] : node.id.split("/")
  }));
}

export function getWikiNode(id: string): WikiBrowserNode | undefined {
  const index = loadWiki(wikiRoot());
  const node = index.byId.get(id);
  return node ? toBrowserNode(index, node) : undefined;
}

export function getWikiNodeBySlug(slug?: string[]): WikiBrowserNode | undefined {
  const id = slug?.length ? slug.join("/") : "ROOT";
  return getWikiNode(id);
}
