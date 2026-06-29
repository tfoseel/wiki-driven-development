import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "./index-wiki.js";

describe("buildWikiIndex", () => {
  it("indexes nodes and dependents", () => {
    const index = buildWikiIndex([
      {
        id: "models/example-model",
        type: "model",
        title: "Example Model",
        filePath: "models/example-model.md",
        body: "",
        wddStatus: {
          phase: "verified",
          code: "reflected",
          verification: "passed"
        },
        dependsOn: ["entities/example-entity"],
        implementedBy: [],
        verifiedBy: [],
        artifacts: [],
        screenshots: [],
        verifyCommands: []
      },
      {
        id: "entities/example-entity",
        type: "entity",
        title: "Example Entity",
        filePath: "entities/example-entity.md",
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
        verifyCommands: []
      }
    ]);

    expect(index.byId.get("models/example-model")?.id).toBe("models/example-model");
    expect(index.dependents.get("entities/example-entity")).toEqual(["models/example-model"]);
  });

  it("fails on dangling dependencies", () => {
    expect(() =>
      buildWikiIndex([
        {
          id: "actions/example-action",
          type: "action",
          title: "Example Action",
          filePath: "actions/example-action.md",
          body: "",
          wddStatus: {
            phase: "verified",
            code: "reflected",
            verification: "passed"
          },
          dependsOn: ["models/missing"],
          implementedBy: [],
          verifiedBy: [],
          artifacts: [],
          screenshots: [],
          verifyCommands: []
        }
      ])
    ).toThrow(/models\/missing/);
  });
});
