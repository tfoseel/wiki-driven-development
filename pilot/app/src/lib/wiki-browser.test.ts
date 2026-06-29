import { describe, expect, it } from "vitest";
import { getWikiNodeBySlug, listWikiNodes, wikiHref } from "./wiki-browser";

describe("wiki browser", () => {
  it("lists the pilot root and wiki browser node", () => {
    const nodes = listWikiNodes();

    expect(nodes[0]).toMatchObject({
      id: "ROOT",
      title: "Mini Booking Pilot",
      type: "root"
    });
    expect(nodes.find((node) => node.id === "pages/wiki-browser")).toMatchObject({
      title: "Wiki Browser",
      implementationRefs: expect.arrayContaining(["pilot/app/src/app/wiki/[[...slug]]/page.tsx"])
    });
  });

  it("resolves nested wiki route slugs to node ids", () => {
    expect(getWikiNodeBySlug(["actions", "cancel-booking"])).toMatchObject({
      id: "actions/cancel-booking",
      title: "Cancel Booking"
    });
  });

  it("builds stable app links for root and nested nodes", () => {
    expect(wikiHref("ROOT")).toBe("/wiki");
    expect(wikiHref("actions/cancel-booking")).toBe("/wiki/actions/cancel-booking");
  });
});
