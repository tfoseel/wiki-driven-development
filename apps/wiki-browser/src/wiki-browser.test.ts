import { describe, expect, it } from "vitest";
import {
  filterWikiNodesByType,
  getWikiNodeBySlug,
  listWikiNodes,
  listStaticWikiParams,
  listStaticWikiTypes,
  listWikiTypeTabs,
  wikiHref,
  wikiHrefWithType
} from "./app/wiki/_lib/wiki-browser";

describe("wiki browser", () => {
  it("lists wiki nodes with workflow status metadata", () => {
    const nodes = listWikiNodes();

    expect(nodes[0]).toMatchObject({
      id: "ROOT",
      type: "root"
    });
    expect(nodes.every((node) => node.wddStatus)).toBe(true);
    expect(nodes.find((node) => node.id === "pages/wiki-browser")).toBeUndefined();
  });

  it("resolves nested wiki route slugs to node ids", () => {
    const nestedNode = listWikiNodes().find((node) => node.id.includes("/") && node.type === "action");
    expect(nestedNode).toBeDefined();

    expect(getWikiNodeBySlug(nestedNode?.id.split("/"))).toMatchObject({
      id: nestedNode?.id,
      wddStatus: {
        phase: "verified",
        code: "reflected",
        verification: "passed"
      }
    });
  });

  it("builds stable app links for root and nested nodes", () => {
    const nestedNode = listWikiNodes().find((node) => node.id.includes("/") && node.type === "action");

    expect(wikiHref("ROOT")).toBe("/wiki");
    expect(wikiHref(nestedNode?.id ?? "")).toBe(`/wiki/${nestedNode?.id}`);
    expect(wikiHrefWithType("ROOT", "all")).toBe("/wiki");
    expect(wikiHrefWithType("ROOT", "action")).toBe("/wiki/type/action");
  });

  it("builds type tabs and filters nodes by selected tab", () => {
    const nodes = listWikiNodes();
    const tabs = listWikiTypeTabs(nodes);

    expect(tabs).toContainEqual({ type: "all", label: "전체", count: nodes.length });
    expect(tabs).toContainEqual({ type: "action", label: "액션", count: 3 });
    expect(tabs).toContainEqual({ type: "page", label: "화면", count: 4 });
    expect(tabs).toContainEqual({ type: "design", label: "디자인", count: 1 });
    expect(tabs.find((tab) => String(tab.type) === "work_item")).toBeUndefined();
    expect(filterWikiNodesByType(nodes, "action").every((node) => node.type === "action")).toBe(true);
  });

  it("exposes static params for GitHub Pages export", () => {
    expect(listStaticWikiParams()).toContainEqual({ slug: [] });
    expect(listStaticWikiParams()).toContainEqual({ slug: ["actions", "create-booking"] });
    expect(listStaticWikiTypes()).toContain("action");
    expect(listStaticWikiTypes()).toContain("page");
  });

  it("keeps the browser scoped to product wiki nodes", () => {
    const nodes = listWikiNodes();

    expect(nodes.some((node) => node.id.startsWith("work-items/"))).toBe(false);
    expect(nodes.some((node) => String(node.type) === "work_item" || String(node.type) === "work_plan")).toBe(false);
  });

  it("exposes references for implementation and verification", () => {
    const nodeWithRefs = listWikiNodes().find((node) => node.implementationRefs.length && node.verificationRefs.length);

    expect(nodeWithRefs?.implementationRefs.length).toBeGreaterThan(0);
    expect(nodeWithRefs?.verificationRefs.length).toBeGreaterThan(0);
  });

  it("exposes impact context for user-facing workflow guidance", () => {
    const createBooking = listWikiNodes().find((node) => node.id === "actions/create-booking");

    expect(createBooking?.impact.impactedNodeIds).toContain("actions/create-booking");
    expect(createBooking?.impact.impactedNodeIds).toContain("pages/booking-new");
    expect(createBooking?.impact.codeFiles).toContain("pilot/app/src/actions/create-booking.ts");
    expect(createBooking?.nextActionLabel).toBe("변경 없음");
  });

  it("exposes QA screenshots declared by page nodes", () => {
    const pageNode = filterWikiNodesByType(listWikiNodes(), "page").find((node) => node.screenshots.length);

    expect(pageNode?.screenshots[0]).toMatchObject({
      path: expect.stringContaining("wiki/assets/screenshots/pages/"),
      src: expect.stringContaining("data:image/png;base64,")
    });
  });
});
