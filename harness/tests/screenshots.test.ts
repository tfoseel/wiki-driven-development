import { describe, expect, it } from "vitest";
import { collectScreenshotTargets } from "../src/screenshots.js";
import { buildWikiIndex } from "../src/index-wiki.js";
import type { WikiNode } from "../src/node.js";

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type">): WikiNode => ({
  id: input.id,
  type: input.type,
  title: input.title ?? input.id,
  wddStatus: input.wddStatus ?? { phase: "verified", code: "reflected", verification: "passed" },
  filePath: input.filePath ?? `${input.id}.md`,
  body: input.body ?? "",
  dependsOn: input.dependsOn ?? [],
  implementedBy: input.implementedBy ?? [],
  verifiedBy: input.verifiedBy ?? [],
  artifacts: input.artifacts ?? [],
  screenshots: input.screenshots ?? [],
  verifyCommands: input.verifyCommands ?? []
});

describe("collectScreenshotTargets", () => {
  it("returns route-backed screenshots declared by screen nodes", () => {
    const index = buildWikiIndex([
      node({
        id: "screens/service-list",
        type: "screen",
        screenshots: [
          {
            path: "wiki/자료/스크린샷/화면/service-list.png",
            alt: "Service list QA pass",
            route: "/services"
          },
          {
            path: "wiki/자료/스크린샷/화면/manual-only.png"
          }
        ]
      }),
      node({
        id: "design/design-system",
        type: "design",
        screenshots: [{ path: "wiki/자료/스크린샷/디자인/design-system.png", route: "/design" }]
      })
    ]);

    expect(collectScreenshotTargets(index)).toEqual([
      {
        nodeId: "screens/service-list",
        path: "wiki/자료/스크린샷/화면/service-list.png",
        alt: "Service list QA pass",
        route: "/services"
      }
    ]);
  });
});
