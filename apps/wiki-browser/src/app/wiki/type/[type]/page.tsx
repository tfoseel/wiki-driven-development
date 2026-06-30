import { notFound } from "next/navigation";
import { getWikiNode, listStaticWikiTypes, listWikiNodes, parseWikiNodeType } from "../../_lib/wiki-browser";
import { WikiBrowserScreen } from "../../[[...slug]]/_components/wiki-browser-screen";

export const dynamicParams = false;

export function generateStaticParams() {
  return listStaticWikiTypes().map((type) => ({ type }));
}

export default async function WikiTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const selectedType = parseWikiNodeType(type);
  const current = getWikiNode("ROOT");
  if (!selectedType || !current) notFound();

  return <WikiBrowserScreen current={current} nodes={listWikiNodes()} selectedType={selectedType} />;
}
