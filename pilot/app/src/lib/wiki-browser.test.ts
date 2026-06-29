import { describe, expect, it } from "vitest";
import {
  filterWikiNodesByType,
  getWikiNodeBySlug,
  listWikiNodes,
  listWikiTypeTabs,
  wikiHref
} from "../app/wiki/_lib/wiki-browser";

describe("wiki browser", () => {
  it("lists the Korean pilot root and product page nodes", () => {
    const nodes = listWikiNodes();

    expect(nodes[0]).toMatchObject({
      id: "ROOT",
      title: "미니 예약 파일럿",
      type: "root"
    });
    expect(nodes.find((node) => node.id === "pages/service-list")).toMatchObject({
      title: "서비스 목록",
      implementationRefs: expect.arrayContaining(["pilot/app/src/app/services/page.tsx"])
    });
    expect(nodes.find((node) => node.id === "pages/wiki-browser")).toBeUndefined();
  });

  it("resolves nested wiki route slugs to node ids", () => {
    expect(getWikiNodeBySlug(["actions", "cancel-booking"])).toMatchObject({
      id: "actions/cancel-booking",
      title: "예약 취소",
      wddStatus: {
        phase: "verified",
        code: "reflected",
        verification: "passed"
      }
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
    expect(tabs).toContainEqual({ type: "page", label: "화면", count: 4 });
    expect(tabs).toContainEqual({ type: "design", label: "디자인", count: 1 });
    expect(filterWikiNodesByType(nodes, "action").map((node) => node.id)).toEqual([
      "actions/cancel-booking",
      "actions/create-booking",
      "actions/reschedule-booking"
    ]);
  });

  it("loads the design system node with structure guidance", () => {
    expect(getWikiNodeBySlug(["design", "design-system"])).toMatchObject({
      id: "design/design-system",
      title: "디자인 시스템",
      implementationRefs: expect.arrayContaining([
        "pilot/app/src/app/globals.css",
        "pilot/app/src/app/services/_components/service-list-screen.tsx"
      ])
    });
  });

  it("keeps the design system node scoped to the booking app UI", () => {
    const node = getWikiNodeBySlug(["design", "design-system"]);

    expect(node?.summary).toContain("예약 앱의 제품 UI");
    expect(node?.body).toContain("예약 앱의 디자인 시스템");
    expect(node?.body).not.toContain("파일럿 위키와 예약 앱");
    expect(node?.body).not.toContain("위키 브라우저");
  });
});
