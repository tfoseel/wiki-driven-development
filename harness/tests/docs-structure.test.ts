import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const harnessRoot = path.resolve(__dirname, "..");

const playbooks = ["change.md", "legacy-migration.md", "repair.md"];

const contracts = ["wiki-node.md", "legacy-map.md", "evidence.md", "status.md"];

describe("harness playbook docs", () => {
  it("keeps playbooks and contracts discoverable from harness/AGENTS.md", () => {
    const agents = fs.readFileSync(path.join(harnessRoot, "AGENTS.md"), "utf8");
    expect(agents).toContain("WDD Harness Agent Router");
    expect(agents).toContain("accepted GitHub Issue");
    expect(fs.existsSync(path.join(harnessRoot, "skills"))).toBe(false);

    for (const file of playbooks) {
      const relativePath = `playbooks/${file}`;
      const fullPath = path.join(harnessRoot, relativePath);
      expect(fs.existsSync(fullPath), `${relativePath} should exist`).toBe(true);
      expect(fs.readFileSync(fullPath, "utf8")).toContain("## When to use");
      expect(agents).toContain(relativePath);
    }

    for (const file of contracts) {
      const relativePath = `contracts/${file}`;
      const fullPath = path.join(harnessRoot, relativePath);
      expect(fs.existsSync(fullPath), `${relativePath} should exist`).toBe(true);
      const content = fs.readFileSync(fullPath, "utf8");
      expect(content).toContain("## Contract");
      expect(agents).toContain(relativePath);
    }

    const changePlaybook = fs.readFileSync(path.join(harnessRoot, "playbooks/change.md"), "utf8");
    expect(changePlaybook).toContain("Closes #");
    expect(changePlaybook).toContain("Refs #");
  });
});
