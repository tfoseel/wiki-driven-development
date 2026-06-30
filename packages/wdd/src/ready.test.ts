import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import { checkReady, formatReadyReport } from "./ready.js";
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
  verifyCommands: input.verifyCommands ?? ["npm test"]
});

describe("checkReady", () => {
  it("passes when workflow, references, screenshots, and verify contracts are aligned", () => {
    const index = buildWikiIndex([
      node({
        id: "pages/example",
        type: "page",
        implementedBy: ["app/page.tsx"],
        verifiedBy: ["app/page.test.ts"],
        screenshots: [{ path: "wiki/assets/screenshots/pages/example.png", route: "/example" }]
      })
    ]);
    const existing = new Set(["app/page.tsx", "app/page.test.ts", "wiki/assets/screenshots/pages/example.png"]);

    expect(checkReady(index, "/repo", (file) => existing.has(file)).ok).toBe(true);
  });

  it("fails when verified nodes still need workflow attention", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/example",
        type: "action",
        wddStatus: { phase: "verification", code: "reflected", verification: "pending" }
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(formatReadyReport(result)).toContain("workflow");
  });

  it("fails when a page screenshot has no route", () => {
    const index = buildWikiIndex([
      node({
        id: "pages/example",
        type: "page",
        screenshots: [{ path: "wiki/assets/screenshots/pages/example.png" }]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "screenshot",
      nodeId: "pages/example",
      message: "Page screenshots must declare route: wiki/assets/screenshots/pages/example.png"
    });
  });
});
