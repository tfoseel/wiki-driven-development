import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "../src/index-wiki.js";
import { selectStatusUpdateNodes, updateWikiNodeStatusMarkdown } from "../src/mark.js";
import type { WikiNode } from "../src/node.js";

const rawHiddenNode = `<!-- wdd
id: screens/example
type: screen
title: Example Screen
wdd_status:
  phase: verified
  code: reflected
  verification: passed
  note: old note
depends_on:
  - actions/example
-->
# Example Screen

## 상태

상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과

## Meaning

Keep this product prose.
`;

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type">): WikiNode => ({
  id: input.id,
  type: input.type,
  title: input.title ?? input.id,
  filePath: input.filePath ?? `${input.id}.md`,
  body: input.body ?? "",
  wddStatus: input.wddStatus ?? { phase: "verified", code: "reflected", verification: "passed" },
  dependsOn: input.dependsOn ?? [],
  implementedBy: input.implementedBy ?? [],
  verifiedBy: input.verifiedBy ?? [],
  artifacts: input.artifacts ?? [],
  screenshots: input.screenshots ?? [],
  verifyCommands: input.verifyCommands ?? []
});

describe("wiki status marker", () => {
  it("updates hidden wdd_status and the visible status summary together", () => {
    const updated = updateWikiNodeStatusMarkdown("wiki/화면/example.md", rawHiddenNode, {
      phase: "coding",
      code: "pending",
      verification: "pending",
      clearNote: true
    });

    expect(updated).toContain("phase: coding");
    expect(updated).toContain("code: pending");
    expect(updated).toContain("verification: pending");
    expect(updated).not.toContain("old note");
    expect(updated).toContain("상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기");
    expect(updated).toContain("Keep this product prose.");
  });

  it("can insert a missing visible status section from hidden metadata", () => {
    const rawWithoutStatus = rawHiddenNode.replace(
      "\n## 상태\n\n상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과\n",
      ""
    );

    const updated = updateWikiNodeStatusMarkdown("wiki/화면/example.md", rawWithoutStatus, {
      phase: "verification",
      code: "reflected",
      verification: "pending"
    });

    expect(updated).toContain("## 상태\n\n상태: 🧪 검증 필요 · 코드 반영됨 · 검증 대기");
    expect(updated.indexOf("## 상태")).toBeLessThan(updated.indexOf("## Meaning"));
  });

  it("requires hidden WDD metadata so raw product pages do not grow visible YAML", () => {
    expect(() =>
      updateWikiNodeStatusMarkdown(
        "wiki/화면/example.md",
        `---
id: screens/example
type: screen
title: Example Screen
---
# Example Screen
`,
        { phase: "coding" }
      )
    ).toThrow(/hidden WDD metadata/);
  });

  it("selects the target node plus downstream impact when requested", () => {
    const index = buildWikiIndex([
      node({ id: "actions/example", type: "action" }),
      node({ id: "screens/example", type: "screen", dependsOn: ["actions/example"] }),
      node({ id: "flows/example", type: "flow", dependsOn: ["screens/example"] }),
      node({ id: "models/upstream", type: "model" })
    ]);

    expect(selectStatusUpdateNodes(index, "actions/example", false).map((item) => item.id)).toEqual([
      "actions/example"
    ]);
    expect(selectStatusUpdateNodes(index, "actions/example", true).map((item) => item.id)).toEqual([
      "actions/example",
      "screens/example",
      "flows/example"
    ]);
  });
});
