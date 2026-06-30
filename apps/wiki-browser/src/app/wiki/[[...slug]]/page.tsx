import { notFound } from "next/navigation";
import { getWikiNodeBySlug, listStaticWikiParams, listWikiNodes } from "../_lib/wiki-browser";
import { WikiBrowserScreen } from "./_components/wiki-browser-screen";

export const dynamicParams = false;

export function generateStaticParams() {
  return listStaticWikiParams();
}

export default async function WikiPage({
  params
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const current = getWikiNodeBySlug(slug);
  if (!current) notFound();

  const selectedType = current.id === "ROOT" ? "all" : current.type;

  return <WikiBrowserScreen current={current} nodes={listWikiNodes()} selectedType={selectedType} />;
}
