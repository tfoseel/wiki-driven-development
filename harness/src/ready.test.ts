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
  body: input.body ?? ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과"].join("\n"),
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
        id: "screens/example",
        type: "screen",
        implementedBy: ["app/page.tsx"],
        verifiedBy: ["app/page.test.ts"],
        screenshots: [{ path: "wiki/자료/스크린샷/화면/example.png", route: "/example" }]
      })
    ]);
    const existing = new Set(["app/page.tsx", "app/page.test.ts", "wiki/자료/스크린샷/화면/example.png"]);

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

  it("fails when a screen screenshot has no route", () => {
    const index = buildWikiIndex([
      node({
        id: "screens/example",
        type: "screen",
        screenshots: [{ path: "wiki/자료/스크린샷/화면/example.png" }]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "screenshot",
      nodeId: "screens/example",
      message: "Screen screenshots must declare route: wiki/자료/스크린샷/화면/example.png"
    });
  });

  it("fails when a reflected screen has no screenshot evidence", () => {
    const index = buildWikiIndex([
      node({
        id: "screens/reflected-without-screenshot",
        type: "screen",
        wddStatus: { phase: "verified", code: "reflected", verification: "passed" },
        screenshots: []
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "screenshot",
      nodeId: "screens/reflected-without-screenshot",
      message: "Reflected screen nodes must declare at least one screenshot."
    });
  });

  it("keeps readiness scoped to product wiki contracts", () => {
    const index = buildWikiIndex([
      node({
        id: "policies/example",
        type: "policy",
        wddStatus: { phase: "verified", code: "not_required", verification: "passed" },
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 불필요 · 검증 통과"].join("\n"),
        verifyCommands: ["npm test"]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(true);
    expect(result.issues.map((issue) => issue.kind)).not.toContain("patch");
  });

  it("fails when the markdown status summary is not canonical", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/example",
        type: "action",
        body: ["## 상태", "", "상태: 좋은 상태"].join("\n")
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "status",
      nodeId: "actions/example",
      message: "Status summary must be exactly: 상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과"
    });
  });
});
