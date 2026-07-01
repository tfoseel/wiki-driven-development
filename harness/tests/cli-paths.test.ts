import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCliPath } from "../src/cli-paths.js";

describe("resolveCliPath", () => {
  it("resolves relative paths from the invocation cwd", () => {
    expect(resolveCliPath("wiki", "/repo", "/repo/harness")).toBe(path.resolve("/repo/wiki"));
  });

  it("leaves absolute paths unchanged", () => {
    expect(resolveCliPath("/tmp/wiki", "/repo", "/repo/harness")).toBe("/tmp/wiki");
  });
});
