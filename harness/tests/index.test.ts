import { describe, expect, it } from "vitest";
import { version } from "../src/index.js";

describe("wdd harness package", () => {
  it("exposes the initial package version", () => {
    expect(version).toBe("0.1.0");
  });
});
