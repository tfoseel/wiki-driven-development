import { describe, expect, it } from "vitest";
import { AvailabilitySlotSchema } from "./availability-slot";

describe("AvailabilitySlotSchema", () => {
  it("accepts timezone-aware available slots", () => {
    expect(
      AvailabilitySlotSchema.parse({
        id: "slot-1",
        serviceId: "consultation",
        startsAt: "2026-07-01T09:00:00+09:00",
        status: "available"
      })
    ).toMatchObject({ status: "available" });
  });

  it("rejects unsupported slot statuses", () => {
    expect(() =>
      AvailabilitySlotSchema.parse({
        id: "slot-1",
        serviceId: "consultation",
        startsAt: "2026-07-01T09:00:00+09:00",
        status: "held"
      })
    ).toThrow();
  });
});
