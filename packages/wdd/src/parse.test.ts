import { describe, expect, it } from "vitest";
import { parseWikiMarkdown } from "./parse.js";

describe("parseWikiMarkdown", () => {
  it("parses required node frontmatter and body", () => {
    const node = parseWikiMarkdown(
      "pilot/wiki/actions/cancel-booking.md",
      `---
id: actions/cancel-booking
type: action
title: Cancel Booking
depends_on: [models/booking]
implemented_by: [pilot/app/src/actions/cancel-booking.ts]
verified_by: [pilot/app/tests/e2e/cancel-booking.spec.ts]
---
# Cancel Booking
`
    );

    expect(node.id).toBe("actions/cancel-booking");
    expect(node.type).toBe("action");
    expect(node.dependsOn).toEqual(["models/booking"]);
    expect(node.implementedBy).toEqual(["pilot/app/src/actions/cancel-booking.ts"]);
    expect(node.verifiedBy).toEqual(["pilot/app/tests/e2e/cancel-booking.spec.ts"]);
  });

  it("fails when id or type is missing", () => {
    expect(() => parseWikiMarkdown("x.md", "---\ntitle: Missing\n---\n")).toThrow(/id/);
  });
});
