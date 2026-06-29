import { describe, expect, it } from "vitest";
import { ServiceSchema } from "./service";

describe("ServiceSchema", () => {
  it("accepts active services with positive duration", () => {
    expect(
      ServiceSchema.parse({ id: "consultation", name: "Initial consultation", durationMinutes: 45, active: true })
    ).toMatchObject({ id: "consultation" });
  });

  it("rejects zero duration services", () => {
    expect(() =>
      ServiceSchema.parse({ id: "bad", name: "Bad service", durationMinutes: 0, active: true })
    ).toThrow();
  });
});
