import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import type { WikiNode } from "./node.js";
import { getVerifyCommands } from "./verify.js";

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type" | "title">): WikiNode => ({
  filePath: `${input.id}.md`,
  body: "",
  wddStatus: {
    phase: "verified",
    code: "reflected",
    verification: "passed"
  },
  dependsOn: [],
  implementedBy: [],
  verifiedBy: [],
  artifacts: [],
  screenshots: [],
  verifyCommands: [],
  ...input
});

describe("getVerifyCommands", () => {
  it("returns commands declared by the node and downstream impacted nodes", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/example-action",
        type: "action",
        title: "Example Action",
        verifyCommands: ["npm run test -- example-action"]
      }),
      node({
        id: "pages/example-page",
        type: "page",
        title: "Example Page",
        dependsOn: ["actions/example-action"],
        verifyCommands: ["npm run e2e -- example-page"]
      })
    ]);

    expect(getVerifyCommands(index, "actions/example-action")).toEqual([
      "npm run test -- example-action",
      "npm run e2e -- example-page"
    ]);
  });
});
