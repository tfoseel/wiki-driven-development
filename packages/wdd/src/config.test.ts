import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadWddConfig, resolveWddProject } from "./config.js";

describe("loadWddConfig", () => {
  it("loads project paths and ready commands from a JSON config", () => {
    const root = path.resolve("../../");
    const config = loadWddConfig(
      path.join(root, "wdd.config.json"),
      `{
        "wikiRoot": "pilot/wiki",
        "repoRoot": ".",
        "appRoot": "pilot/app",
        "ready": {
          "commands": ["npm run test -w @wdd/harness"]
        }
      }`
    );

    expect(config).toEqual({
      wikiRoot: "pilot/wiki",
      repoRoot: ".",
      appRoot: "pilot/app",
      ready: {
        commands: ["npm run test -w @wdd/harness"]
      }
    });
  });

  it("rejects configs without a wiki root", () => {
    expect(() => loadWddConfig("/repo/wdd.config.json", `{ "repoRoot": "." }`)).toThrow("missing wikiRoot");
  });
});

describe("resolveWddProject", () => {
  it("resolves config paths relative to the config file", () => {
    const project = resolveWddProject("/repo/wdd.config.json", {
      wikiRoot: "pilot/wiki",
      repoRoot: ".",
      appRoot: "pilot/app"
    });

    expect(project).toMatchObject({
      wikiRoot: "/repo/pilot/wiki",
      repoRoot: "/repo",
      appRoot: "/repo/pilot/app"
    });
  });
});
