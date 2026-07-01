import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findWddConfig, loadWddConfig, resolveWddProject } from "../src/config.js";

const tempDirs: string[] = [];

describe("loadWddConfig", () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("loads project paths and ready commands from a JSON config", () => {
    const root = path.resolve("../../");
    const config = loadWddConfig(
      path.join(root, "wdd.config.json"),
      `{
        "wikiRoot": "../wiki",
        "repoRoot": "..",
        "appRoot": "..",
        "ready": {
          "commands": ["npm run harness:test"]
        }
      }`
    );

    expect(config).toEqual({
      wikiRoot: "../wiki",
      repoRoot: "..",
      appRoot: "..",
      ready: {
        commands: ["npm run harness:test"]
      }
    });
  });

  it("rejects configs without a wiki root", () => {
    expect(() => loadWddConfig("/repo/wdd.config.json", `{ "repoRoot": "." }`)).toThrow("missing wikiRoot");
  });
});

describe("findWddConfig", () => {
  afterEach(() => {
    for (const dir of tempDirs.splice(0)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it("finds harness/wdd.config.json from a Next.js project root", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "wdd-project-"));
    tempDirs.push(root);
    const harnessRoot = path.join(root, "harness");
    fs.mkdirSync(harnessRoot, { recursive: true });
    fs.writeFileSync(path.join(harnessRoot, "wdd.config.json"), `{ "wikiRoot": "../wiki" }`);

    expect(findWddConfig(path.join(root, "src/app"))).toBe(path.join(harnessRoot, "wdd.config.json"));
  });
});

describe("resolveWddProject", () => {
  it("resolves config paths relative to the config file", () => {
    const project = resolveWddProject("/repo/harness/wdd.config.json", {
      wikiRoot: "../wiki",
      repoRoot: "..",
      appRoot: ".."
    });

    expect(project).toMatchObject({
      wikiRoot: "/repo/wiki",
      repoRoot: "/repo",
      appRoot: "/repo"
    });
  });
});
