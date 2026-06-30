import { beforeEach, describe, expect, it } from "vitest";
import { cancelBooking } from "./cancel-booking";
import { getBooking, getSlot, resetSeedStore } from "../lib/seed-store";

describe("cancelBooking", () => {
  beforeEach(() => resetSeedStore());

  it("cancels a booking outside the policy boundary and releases its slot", async () => {
    const result = await cancelBooking(
      { bookingId: "booking-confirmed-001" },
      new Date("2026-06-30T08:00:00+09:00")
    );

    expect(result).toMatchObject({ ok: true });
    expect(getBooking("booking-confirmed-001")?.status).toBe("cancelled");
    expect(getSlot("slot-consultation-tomorrow-1100")?.status).toBe("available");
  });

  it("blocks cancellation inside the 24 hour policy boundary", async () => {
    const result = await cancelBooking(
      { bookingId: "booking-confirmed-001" },
      new Date("2026-07-01T10:00:00+09:00")
    );

    expect(result).toMatchObject({ ok: false, code: "policy_blocked" });
  });
});
