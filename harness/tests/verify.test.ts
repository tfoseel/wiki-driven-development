import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "../src/index-wiki.js";
import type { WikiNode } from "../src/node.js";
import { getVerifyCommands } from "../src/verify.js";

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
        id: "screens/example-screen",
        type: "screen",
        title: "Example Screen",
        dependsOn: ["actions/example-action"],
        verifyCommands: ["npm run e2e -- example-screen"]
      })
    ]);

    expect(getVerifyCommands(index, "actions/example-action")).toEqual([
      "npm run test -- example-action",
      "npm run e2e -- example-screen"
    ]);
  });
});
