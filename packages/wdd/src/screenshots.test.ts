import { describe, expect, it } from "vitest";
import { collectScreenshotTargets } from "./screenshots.js";
import { buildWikiIndex } from "./index-wiki.js";
import type { WikiNode } from "./node.js";

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
  it("returns route-backed screenshots declared by page nodes", () => {
    const index = buildWikiIndex([
      node({
        id: "pages/service-list",
        type: "page",
        screenshots: [
          {
            path: "pilot/wiki/assets/screenshots/pages/service-list.png",
            alt: "Service list QA pass",
            route: "/services"
          },
          {
            path: "pilot/wiki/assets/screenshots/pages/manual-only.png"
          }
        ]
      }),
      node({
        id: "design/design-system",
        type: "design",
        screenshots: [{ path: "pilot/wiki/assets/screenshots/design/design-system.png", route: "/design" }]
      })
    ]);

    expect(collectScreenshotTargets(index)).toEqual([
      {
        nodeId: "pages/service-list",
        path: "pilot/wiki/assets/screenshots/pages/service-list.png",
        alt: "Service list QA pass",
        route: "/services"
      }
    ]);
  });
});
