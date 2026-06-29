import { notFound } from "next/navigation";
import { getWikiNodeBySlug, listWikiNodes } from "../../../lib/wiki-browser";
import { WikiBrowserScreen } from "../../../screens/wiki-browser/screen";

export const runtime = "nodejs";

export default async function WikiPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const current = getWikiNodeBySlug(slug);
  if (!current) notFound();

  return <WikiBrowserScreen current={current} nodes={listWikiNodes()} />;
}
