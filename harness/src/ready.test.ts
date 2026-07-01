import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import { checkReady, formatReadyReport } from "./ready.js";
import type { WikiNode } from "./node.js";

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type">): WikiNode => ({
  id: input.id,
  type: input.type,
  title: input.title ?? input.id,
  metadataFormat: input.metadataFormat,
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
        filePath: "wiki/화면/example.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![Example](../자료/스크린샷/화면/example.png)"].join("\n"),
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

  it("fails when a screen screenshot is not shown inline in the markdown body", () => {
    const index = buildWikiIndex([
      node({
        id: "screens/missing-inline-screenshot",
        type: "screen",
        filePath: "wiki/화면/missing-inline-screenshot.md",
        screenshots: [{ path: "wiki/자료/스크린샷/화면/missing-inline-screenshot.png", route: "/missing" }]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "screenshot",
      nodeId: "screens/missing-inline-screenshot",
      message: "Screen screenshot must be embedded inline in markdown: wiki/자료/스크린샷/화면/missing-inline-screenshot.png"
    });
  });

  it("fails when wiki metadata is visible frontmatter", () => {
    const index = buildWikiIndex([
      node({
        id: "screens/visible-frontmatter",
        type: "screen",
        metadataFormat: "frontmatter",
        filePath: "wiki/화면/visible-frontmatter.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![Visible](../자료/스크린샷/화면/visible.png)"].join("\n"),
        screenshots: [{ path: "wiki/자료/스크린샷/화면/visible.png", route: "/visible" }]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "metadata",
      nodeId: "screens/visible-frontmatter",
      message: "WDD metadata must be hidden in an HTML comment: <!-- wdd ... -->"
    });
  });

  it("fails when a flow screen tree does not embed dependent screen screenshots", () => {
    const index = buildWikiIndex([
      node({
        id: "flows/create-example",
        type: "flow",
        filePath: "wiki/흐름/create-example.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "## 화면 트리", "- [[screens/example]]"].join("\n"),
        dependsOn: ["screens/example"]
      }),
      node({
        id: "screens/example",
        type: "screen",
        filePath: "wiki/화면/example.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![Example](../자료/스크린샷/화면/example.png)"].join("\n"),
        screenshots: [{ path: "wiki/자료/스크린샷/화면/example.png", route: "/example" }]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "screenshot",
      nodeId: "flows/create-example",
      message: "Flow screen tree must embed dependent screen screenshot: wiki/자료/스크린샷/화면/example.png"
    });
  });

  it("fails when a verified flow does not embed a generated flow tree capture", () => {
    const index = buildWikiIndex([
      node({
        id: "flows/create-example",
        type: "flow",
        filePath: "wiki/흐름/create-example.md",
        body: [
          "## 상태",
          "",
          "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과",
          "",
          "## 화면 트리",
          "",
          "<details>",
          "<summary>Mermaid source</summary>",
          "",
          "```mermaid",
          "flowchart TD",
          "  example[\"Example<br/><img src='../자료/스크린샷/화면/example.png' width='160' />\"]",
          "```",
          "",
          "</details>"
        ].join("\n"),
        dependsOn: ["screens/example"]
      }),
      node({
        id: "screens/example",
        type: "screen",
        filePath: "wiki/화면/example.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![Example](../자료/스크린샷/화면/example.png)"].join("\n"),
        screenshots: [{ path: "wiki/자료/스크린샷/화면/example.png", route: "/example" }]
      })
    ]);

    const result = checkReady(index, "/repo", () => true);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "flow-tree",
      nodeId: "flows/create-example",
      message: "Verified flow nodes must embed a generated flow tree capture image."
    });
  });

  it("fails when a verified flow tree capture file is missing", () => {
    const index = buildWikiIndex([
      node({
        id: "flows/create-example",
        type: "flow",
        filePath: "wiki/흐름/create-example.md",
        body: [
          "## 상태",
          "",
          "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과",
          "",
          "## 화면 트리",
          "",
          "![Create example screen tree](../자료/흐름/create-example-screen-tree.png)",
          "",
          "<details>",
          "<summary>Mermaid source</summary>",
          "",
          "```mermaid",
          "flowchart TD",
          "  example[\"Example<br/><img src='../자료/스크린샷/화면/example.png' width='160' />\"]",
          "```",
          "",
          "</details>"
        ].join("\n"),
        dependsOn: ["screens/example"]
      }),
      node({
        id: "screens/example",
        type: "screen",
        filePath: "wiki/화면/example.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![Example](../자료/스크린샷/화면/example.png)"].join("\n"),
        screenshots: [{ path: "wiki/자료/스크린샷/화면/example.png", route: "/example" }]
      })
    ]);

    const result = checkReady(index, "/repo", (file) => file !== "wiki/자료/흐름/create-example-screen-tree.png");

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual({
      kind: "flow-tree",
      nodeId: "flows/create-example",
      message: "Missing generated flow tree capture: wiki/자료/흐름/create-example-screen-tree.png"
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
