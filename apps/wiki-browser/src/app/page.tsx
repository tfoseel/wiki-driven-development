import { getWikiNode, listWikiNodes } from "./wiki/_lib/wiki-browser";
import { WikiBrowserScreen } from "./wiki/[[...slug]]/_components/wiki-browser-screen";

export default function HomePage() {
  const current = getWikiNode("ROOT");
  if (!current) return null;

  return <WikiBrowserScreen current={current} nodes={listWikiNodes()} selectedType="all" />;
}
