import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import { formatSessionContext } from "./session.js";
import type { WikiNode } from "./node.js";

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type" | "title">): WikiNode => ({
  filePath: `${input.id}.md`,
  body: "## Intent\nA product-readable wiki body.",
  summary: undefined,
  dependsOn: [],
  implementedBy: [],
  verifiedBy: [],
  artifacts: [],
  verifyCommands: [],
  wddStatus: {
    phase: "verified",
    code: "reflected",
    verification: "passed"
  },
  ...input
});

describe("formatSessionContext", () => {
  it("prints an agent-ready wiki-first context pack", () => {
    const index = buildWikiIndex([
      node({ id: "entities/bookings", type: "entity", title: "Bookings" }),
      node({
        id: "models/booking",
        type: "model",
        title: "Booking",
        dependsOn: ["entities/bookings"]
      }),
      node({
        id: "actions/cancel-booking",
        type: "action",
        title: "Cancel Booking",
        dependsOn: ["models/booking"],
        implementedBy: ["pilot/app/src/actions/cancel-booking.ts"],
        verifiedBy: ["pilot/app/tests/e2e/cancel-booking.spec.ts"],
        verifyCommands: ["npm run test -- cancel-booking"],
        wddStatus: {
          phase: "coding",
          code: "pending",
          verification: "pending",
          note: "Wiki contract changed; code has not caught up yet."
        }
      }),
      node({
        id: "pages/booking-detail",
        type: "page",
        title: "Booking Detail",
        dependsOn: ["actions/cancel-booking"],
        artifacts: ["pilot/app/src/screens/booking-detail/screen.tsx"]
      })
    ]);

    const context = formatSessionContext(index, "actions/cancel-booking");

    expect(context).toContain("# WDD Session: Cancel Booking");
    expect(context).toContain("Edit the wiki first, including impacted wiki nodes");
    expect(context).toContain("Run verify, drift, and status before marking nodes as phase: verified.");
    expect(context).toContain("## Workflow Status");
    expect(context).toContain("phase: coding");
    expect(context).toContain("Next phase: update referenced code before verification.");
    expect(context).toContain("- `models/booking` — Booking");
    expect(context).toContain("- `pages/booking-detail` — Booking Detail");
    expect(context).toContain("pilot/app/src/actions/cancel-booking.ts");
    expect(context).toContain("pilot/app/src/screens/booking-detail/screen.tsx");
    expect(context).toContain("npm run test -- cancel-booking");
  });
});
