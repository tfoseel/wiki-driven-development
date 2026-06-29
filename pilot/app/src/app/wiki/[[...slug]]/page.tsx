import { notFound } from "next/navigation";
import { getWikiNodeBySlug, listWikiNodes, parseWikiTypeTab } from "../_lib/wiki-browser";
import { WikiBrowserScreen } from "./_components/wiki-browser-screen";

export const runtime = "nodejs";

export default async function WikiPage({
  params,
  searchParams
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const current = getWikiNodeBySlug(slug);
  if (!current) notFound();

  const selectedType = parseWikiTypeTab(sp.type);
  const effectiveSelectedType = selectedType === "all" && current.id !== "ROOT" ? current.type : selectedType;

  return <WikiBrowserScreen current={current} nodes={listWikiNodes()} selectedType={effectiveSelectedType} />;
}
