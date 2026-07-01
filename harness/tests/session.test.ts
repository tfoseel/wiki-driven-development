import { describe, expect, it } from "vitest";
import { buildWikiIndex } from "../src/index-wiki.js";
import { formatSessionContext } from "../src/session.js";
import type { WikiNode } from "../src/node.js";

const node = (input: Partial<WikiNode> & Pick<WikiNode, "id" | "type" | "title">): WikiNode => ({
  filePath: `${input.id}.md`,
  body: "## Intent\nA product-readable wiki body.",
  summary: undefined,
  dependsOn: [],
  implementedBy: [],
  verifiedBy: [],
  artifacts: [],
  screenshots: [],
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
      node({ id: "entities/example-entity", type: "entity", title: "Example Entity" }),
      node({
        id: "models/example-model",
        type: "model",
        title: "Example Model",
        dependsOn: ["entities/example-entity"]
      }),
      node({
        id: "actions/example-action",
        type: "action",
        title: "Example Action",
        dependsOn: ["models/example-model"],
        implementedBy: ["app/src/actions/example-action.ts"],
        verifiedBy: ["app/tests/e2e/example-action.spec.ts"],
        verifyCommands: ["npm run test -- example-action"],
        wddStatus: {
          phase: "coding",
          code: "pending",
          verification: "pending",
          note: "Wiki contract changed; code has not caught up yet."
        }
      }),
      node({
        id: "screens/example-screen",
        type: "screen",
        title: "Example Screen",
        dependsOn: ["actions/example-action"],
        artifacts: ["app/src/app/examples/[id]/_components/example-screen.tsx"]
      })
    ]);

    const context = formatSessionContext(index, "actions/example-action");

    expect(context).toContain("# WDD Session: Example Action");
    expect(context).toContain("Edit the wiki first, including impacted wiki nodes");
    expect(context).toContain("Run verify, drift, and status before marking nodes as phase: verified.");
    expect(context).toContain("## Workflow Status");
    expect(context).toContain("phase: coding");
    expect(context).toContain("Next phase: update referenced code before verification.");
    expect(context).toContain("- `models/example-model` — Example Model");
    expect(context).toContain("- `screens/example-screen` — Example Screen");
    expect(context).toContain("app/src/actions/example-action.ts");
    expect(context).toContain("app/src/app/examples/[id]/_components/example-screen.tsx");
    expect(context).toContain("npm run test -- example-action");
  });
});
