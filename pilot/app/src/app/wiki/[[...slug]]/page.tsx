import { notFound } from "next/navigation";
import { getWikiNodeBySlug, listWikiNodes, parseWikiTypeTab } from "../../../lib/wiki-browser";
import { WikiBrowserScreen } from "../../../screens/wiki-browser/screen";

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

  return <WikiBrowserScreen current={current} nodes={listWikiNodes()} selectedType={parseWikiTypeTab(sp.type)} />;
}
