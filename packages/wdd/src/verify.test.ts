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
  verifyCommands: [],
  ...input
});

describe("getVerifyCommands", () => {
  it("returns commands declared by the node and downstream impacted nodes", () => {
    const index = buildWikiIndex([
      node({
        id: "actions/cancel-booking",
        type: "action",
        title: "Cancel Booking",
        verifyCommands: ["npm run test -- cancel-booking"]
      }),
      node({
        id: "pages/booking-detail",
        type: "page",
        title: "Booking Detail",
        dependsOn: ["actions/cancel-booking"],
        verifyCommands: ["npm run e2e -- booking-detail"]
      })
    ]);

    expect(getVerifyCommands(index, "actions/cancel-booking")).toEqual([
      "npm run test -- cancel-booking",
      "npm run e2e -- booking-detail"
    ]);
  });
});
