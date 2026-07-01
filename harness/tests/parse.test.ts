import { describe, expect, it } from "vitest";
import { parseWikiMarkdown } from "../src/parse.js";

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
screenshots:
  - path: wiki/화면/example-screen/스크린샷.png
    alt: Example screen after QA
    route: /examples/1
assets:
  - path: public/images/example-hero.png
    purpose: Hero illustration
    source: Product design handoff
legacy:
  status: observed
---
# Example Action
`
    );

    expect(node.id).toBe("actions/example-action");
    expect(node.type).toBe("action");
    expect(node.metadataFormat).toBe("frontmatter");
    expect(node.wddStatus).toEqual({
      phase: "coding",
      code: "pending",
      verification: "pending"
    });
    expect(node.dependsOn).toEqual(["models/example-model"]);
    expect(node.implementedBy).toEqual(["app/src/actions/example-action.ts"]);
    expect(node.verifiedBy).toEqual(["app/tests/e2e/example-action.spec.ts"]);
    expect(node.screenshots).toEqual([
      {
        path: "wiki/화면/example-screen/스크린샷.png",
        alt: "Example screen after QA",
        route: "/examples/1"
      }
    ]);
    expect(node.assets).toEqual([
      {
        path: "public/images/example-hero.png",
        purpose: "Hero illustration",
        source: "Product design handoff"
      }
    ]);
    expect(node.legacy).toEqual({
      status: "observed"
    });
  });

  it("rejects legacy provenance fields inside product wiki metadata", () => {
    expect(() =>
      parseWikiMarkdown(
        "wiki/화면/login.md",
        `---
id: screens/login
type: screen
title: Login
legacy_sources:
  - pages/login/index.tsx
---
# Login
`
      )
    ).toThrow(/legacy_sources belongs in legacy-map.json or the GitHub Issue/);

    expect(() =>
      parseWikiMarkdown(
        "wiki/화면/login.md",
        `---
id: screens/login
type: screen
title: Login
legacy:
  status: observed
  sources:
    - pages/login/index.tsx
---
# Login
`
      )
    ).toThrow(/legacy.sources belongs in legacy-map.json or the GitHub Issue/);
  });

  it("parses hidden WDD metadata without exposing it as body content", () => {
    const node = parseWikiMarkdown(
      "wiki/화면/example.md",
      `<!-- wdd
id: screens/example
type: screen
title: Example Screen
wdd_status:
  phase: verified
  code: reflected
  verification: passed
screenshots:
  - path: wiki/화면/example/스크린샷.png
    alt: Example screen after QA
    route: /example
verify:
  - npm run e2e -- example
-->
# Example Screen

![Example screen after QA](../화면/example/스크린샷.png)
`
    );

    expect(node.id).toBe("screens/example");
    expect(node.type).toBe("screen");
    expect(node.metadataFormat).toBe("hidden-wdd");
    expect(node.body.startsWith("# Example Screen")).toBe(true);
    expect(node.body).not.toContain("screenshots:");
    expect(node.screenshots).toEqual([
      {
        path: "wiki/화면/example/스크린샷.png",
        alt: "Example screen after QA",
        route: "/example"
      }
    ]);
  });

  it("fails when id or type is missing", () => {
    expect(() => parseWikiMarkdown("x.md", "---\ntitle: Missing\n---\n")).toThrow(/id/);
  });

  it("rejects work tracking as product wiki node types", () => {
    expect(() =>
      parseWikiMarkdown(
        "wiki/work-items/add-calendar-button.md",
        `---
id: work-items/add-calendar-button
type: work_item
title: Add Calendar Button
---
# Add Calendar Button
`
      )
    ).toThrow(/invalid type work_item/);
  });
});
