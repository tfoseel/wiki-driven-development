import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import { collectFlowTreeTargets } from "./flow-trees.js";
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

describe("collectFlowTreeTargets", () => {
  it("collects generated capture targets, Mermaid source, and dependent screen screenshots", () => {
    const index = buildWikiIndex([
      node({
        id: "flows/create-example",
        type: "flow",
        title: "Create Example",
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
          "  start[\"Start<br/><img src='../자료/스크린샷/화면/start.png' width='160' />\"]",
          "  end[\"End<br/><img src='../자료/스크린샷/화면/end.png' width='160' />\"]",
          "  start -->|Continue| end",
          "```",
          "",
          "</details>"
        ].join("\n"),
        dependsOn: ["screens/start", "screens/end"]
      }),
      node({
        id: "screens/start",
        type: "screen",
        title: "Start",
        filePath: "wiki/화면/start.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![Start](../자료/스크린샷/화면/start.png)"].join("\n"),
        screenshots: [{ path: "wiki/자료/스크린샷/화면/start.png", route: "/start", alt: "Start screen" }]
      }),
      node({
        id: "screens/end",
        type: "screen",
        title: "End",
        filePath: "wiki/화면/end.md",
        body: ["## 상태", "", "상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과", "", "![End](../자료/스크린샷/화면/end.png)"].join("\n"),
        screenshots: [{ path: "wiki/자료/스크린샷/화면/end.png", route: "/end", alt: "End screen" }]
      })
    ]);

    expect(collectFlowTreeTargets(index, "/repo")).toEqual([
      {
        nodeId: "flows/create-example",
        title: "Create Example",
        path: "wiki/자료/흐름/create-example-screen-tree.png",
        source: [
          "flowchart TD",
          "  start[\"Start<br/><img src='../자료/스크린샷/화면/start.png' width='160' />\"]",
          "  end[\"End<br/><img src='../자료/스크린샷/화면/end.png' width='160' />\"]",
          "  start -->|Continue| end"
        ].join("\n"),
        screens: [
          {
            nodeId: "screens/start",
            title: "Start",
            screenshotPath: "wiki/자료/스크린샷/화면/start.png",
            alt: "Start screen"
          },
          {
            nodeId: "screens/end",
            title: "End",
            screenshotPath: "wiki/자료/스크린샷/화면/end.png",
            alt: "End screen"
          }
        ]
      }
    ]);
  });
});
