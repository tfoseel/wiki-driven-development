import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";
import { calculateImpact } from "./impact.js";
import type { WikiNode, WikiNodeType } from "./node.js";

const typeForId = (id: string): WikiNodeType => {
  const [group] = id.split("/");
  switch (group) {
    case "entities":
      return "entity";
    case "models":
      return "model";
    case "actions":
      return "action";
    case "pages":
      return "page";
    case "flows":
      return "flow";
    case "policies":
      return "policy";
    case "qa":
      return "qa";
    default:
      throw new Error(`Unknown test node group: ${group}`);
  }
};

const node = (id: string, dependsOn: string[] = [], code: string[] = []): WikiNode => ({
  id,
  type: typeForId(id),
  title: id,
  filePath: `${id}.md`,
  body: "",
  dependsOn,
  implementedBy: code,
  verifiedBy: [],
  artifacts: [],
  verifyCommands: []
});

describe("calculateImpact", () => {
  it("returns upstream, downstream, and code files", () => {
    const index = buildWikiIndex([
      node("entities/bookings"),
      node("models/booking", ["entities/bookings"], ["pilot/app/src/models/booking.ts"]),
      node("actions/cancel-booking", ["models/booking"], ["pilot/app/src/actions/cancel-booking.ts"]),
      node("pages/booking-detail", ["actions/cancel-booking"], ["pilot/app/src/app/bookings/[id]/page.tsx"])
    ]);

    const impact = calculateImpact(index, "actions/cancel-booking");

    expect(impact.upstream).toEqual(["models/booking", "entities/bookings"]);
    expect(impact.downstream).toEqual(["pages/booking-detail"]);
    expect(impact.codeFiles).toContain("pilot/app/src/actions/cancel-booking.ts");
    expect(impact.codeFiles).toContain("pilot/app/src/app/bookings/[id]/page.tsx");
  });
});
