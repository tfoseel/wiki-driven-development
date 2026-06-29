import { describe, expect, it } from "vitest";
import { filterWikiNodesByType, getWikiNodeBySlug, listWikiNodes, listWikiTypeTabs, wikiHref } from "./wiki-browser";

describe("wiki browser", () => {
  it("lists the Korean pilot root and wiki browser node", () => {
    const nodes = listWikiNodes();

    expect(nodes[0]).toMatchObject({
      id: "ROOT",
      title: "미니 예약 파일럿",
      type: "root"
    });
    expect(nodes.find((node) => node.id === "pages/wiki-browser")).toMatchObject({
      title: "위키 브라우저",
      implementationRefs: expect.arrayContaining(["pilot/app/src/app/wiki/[[...slug]]/page.tsx"])
    });
  });

  it("resolves nested wiki route slugs to node ids", () => {
    expect(getWikiNodeBySlug(["actions", "cancel-booking"])).toMatchObject({
      id: "actions/cancel-booking",
      title: "예약 취소"
    });
  });

  it("builds stable app links for root and nested nodes", () => {
    expect(wikiHref("ROOT")).toBe("/wiki");
    expect(wikiHref("actions/cancel-booking")).toBe("/wiki/actions/cancel-booking");
  });

  it("builds type tabs and filters nodes by selected tab", () => {
    const nodes = listWikiNodes();
    const tabs = listWikiTypeTabs(nodes);

    expect(tabs).toContainEqual({ type: "all", label: "전체", count: nodes.length });
    expect(tabs).toContainEqual({ type: "action", label: "액션", count: 3 });
    expect(tabs).toContainEqual({ type: "page", label: "화면", count: 5 });
    expect(filterWikiNodesByType(nodes, "action").map((node) => node.id)).toEqual([
      "actions/cancel-booking",
      "actions/create-booking",
      "actions/reschedule-booking"
    ]);
  });
});
