import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const harnessRoot = path.resolve(__dirname, "..");

const workShapingSkills = ["00-grill-request.md", "01-write-prd-issue.md", "02-slice-work.md"];

const cadenceSkills = [
  "01-wiki-edit-phase.md",
  "02-impact-phase.md",
  "03-coding-sync-phase.md",
  "04-verification-qa-phase.md",
  "05-ready-pr-phase.md",
  "06-wiki-consistency.md"
];

const wikiAreaSkills = ["entity.md", "model.md", "action.md", "screen.md", "flow.md", "qa.md", "policy.md", "design.md", "term-root.md"];

describe("harness skill docs", () => {
  it("keeps work-shaping, cadence, and wiki-area skills discoverable from harness/AGENTS.md", () => {
    const agents = fs.readFileSync(path.join(harnessRoot, "AGENTS.md"), "utf8");
    expect(agents).toContain("WDD Harness Agent Router");
    expect(agents).toContain("accepted GitHub Issue");

    for (const file of workShapingSkills) {
      const relativePath = `skills/work-shaping/${file}`;
      const fullPath = path.join(harnessRoot, relativePath);
      expect(fs.existsSync(fullPath), `${relativePath} should exist`).toBe(true);
      expect(fs.readFileSync(fullPath, "utf8")).toContain("## When to use");
      expect(agents).toContain(relativePath);
    }

    expect(fs.existsSync(path.join(harnessRoot, "skills/cadence/00-github-issue-intake.md"))).toBe(false);

    for (const file of cadenceSkills) {
      const relativePath = `skills/cadence/${file}`;
      const fullPath = path.join(harnessRoot, relativePath);
      expect(fs.existsSync(fullPath), `${relativePath} should exist`).toBe(true);
      expect(fs.readFileSync(fullPath, "utf8")).toContain("## When to use");
      expect(agents).toContain(relativePath);
    }

    const readyPrPhase = fs.readFileSync(path.join(harnessRoot, "skills/cadence/05-ready-pr-phase.md"), "utf8");
    expect(readyPrPhase).toContain("Closes #");
    expect(readyPrPhase).toContain("Refs #");

    for (const file of wikiAreaSkills) {
      const relativePath = `skills/wiki-areas/${file}`;
      const fullPath = path.join(harnessRoot, relativePath);
      expect(fs.existsSync(fullPath), `${relativePath} should exist`).toBe(true);
      expect(fs.readFileSync(fullPath, "utf8")).toContain("## Authoring contract");
      expect(agents).toContain(relativePath);
    }
  });
});
