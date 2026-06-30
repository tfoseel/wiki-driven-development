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
    case "screens":
      return "screen";
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
  wddStatus: {
    phase: "verified",
    code: code.length ? "reflected" : "not_required",
    verification: "passed"
  },
  dependsOn,
  implementedBy: code,
  verifiedBy: [],
  artifacts: [],
  screenshots: [],
  verifyCommands: [],
});

describe("calculateImpact", () => {
  it("returns upstream, downstream, and code files", () => {
    const index = buildWikiIndex([
      node("entities/example-entity"),
      node("models/example-model", ["entities/example-entity"], ["app/src/models/example-model.ts"]),
      node("actions/example-action", ["models/example-model"], ["app/src/actions/example-action.ts"]),
      node("screens/example-screen", ["actions/example-action"], ["app/src/app/examples/[id]/page.tsx"])
    ]);

    const impact = calculateImpact(index, "actions/example-action");

    expect(impact.upstream).toEqual(["models/example-model", "entities/example-entity"]);
    expect(impact.downstream).toEqual(["screens/example-screen"]);
    expect(impact.codeFiles).toContain("app/src/actions/example-action.ts");
    expect(impact.codeFiles).toContain("app/src/app/examples/[id]/page.tsx");
  });
});
