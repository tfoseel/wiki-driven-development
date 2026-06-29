import { describe, expect, it } from "vitest";
import { parseWikiMarkdown } from "./parse.js";

describe("parseWikiMarkdown", () => {
  it("parses required node frontmatter and body", () => {
    const node = parseWikiMarkdown(
      "wiki/actions/example-action.md",
      `---
id: actions/example-action
type: action
title: Example Action
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on: [models/example-model]
implemented_by: [app/src/actions/example-action.ts]
verified_by: [app/tests/e2e/example-action.spec.ts]
---
# Example Action
`
    );

    expect(node.id).toBe("actions/example-action");
    expect(node.type).toBe("action");
    expect(node.wddStatus).toEqual({
      phase: "coding",
      code: "pending",
      verification: "pending"
    });
    expect(node.dependsOn).toEqual(["models/example-model"]);
    expect(node.implementedBy).toEqual(["app/src/actions/example-action.ts"]);
    expect(node.verifiedBy).toEqual(["app/tests/e2e/example-action.spec.ts"]);
  });

  it("fails when id or type is missing", () => {
    expect(() => parseWikiMarkdown("x.md", "---\ntitle: Missing\n---\n")).toThrow(/id/);
  });
});
