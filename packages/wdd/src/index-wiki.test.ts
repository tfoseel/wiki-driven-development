import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";

describe("buildWikiIndex", () => {
  it("indexes nodes and dependents", () => {
    const index = buildWikiIndex([
      {
        id: "models/booking",
        type: "model",
        title: "Booking",
        filePath: "models/booking.md",
        body: "",
        dependsOn: ["entities/bookings"],
        implementedBy: [],
        verifiedBy: [],
        artifacts: [],
        verifyCommands: []
      },
      {
        id: "entities/bookings",
        type: "entity",
        title: "Bookings",
        filePath: "entities/bookings.md",
        body: "",
        dependsOn: [],
        implementedBy: [],
        verifiedBy: [],
        artifacts: [],
        verifyCommands: []
      }
    ]);

    expect(index.byId.get("models/booking")?.id).toBe("models/booking");
    expect(index.dependents.get("entities/bookings")).toEqual(["models/booking"]);
  });

  it("fails on dangling dependencies", () => {
    expect(() =>
      buildWikiIndex([
        {
          id: "actions/cancel-booking",
          type: "action",
          title: "Cancel",
          filePath: "actions/cancel-booking.md",
          body: "",
          dependsOn: ["models/missing"],
          implementedBy: [],
          verifiedBy: [],
          artifacts: [],
          verifyCommands: []
        }
      ])
    ).toThrow(/models\/missing/);
  });
});
