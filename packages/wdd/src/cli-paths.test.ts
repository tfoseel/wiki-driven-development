import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveCliPath } from "./cli-paths.js";

describe("resolveCliPath", () => {
  it("resolves relative paths from the invocation cwd", () => {
    expect(resolveCliPath("pilot/wiki", "/repo", "/repo/packages/wdd")).toBe(path.resolve("/repo/pilot/wiki"));
  });

  it("leaves absolute paths unchanged", () => {
    expect(resolveCliPath("/tmp/wiki", "/repo", "/repo/packages/wdd")).toBe("/tmp/wiki");
  });
});
