import { beforeEach, describe, expect, it } from "vitest";
import { rescheduleBooking } from "./reschedule-booking";
import { getBooking, getSlot, resetSeedStore } from "../lib/seed-store";

describe("rescheduleBooking", () => {
  beforeEach(() => resetSeedStore());

  it("moves a booking to an available target slot", async () => {
    const result = await rescheduleBooking(
      { bookingId: "booking-confirmed-001", targetSlotId: "slot-consultation-tomorrow-0900" },
      new Date("2026-06-30T08:00:00+09:00")
    );

    expect(result).toMatchObject({ ok: true });
    expect(getBooking("booking-confirmed-001")?.slotId).toBe("slot-consultation-tomorrow-0900");
    expect(getBooking("booking-confirmed-001")?.status).toBe("rescheduled");
    expect(getSlot("slot-consultation-tomorrow-1100")?.status).toBe("available");
    expect(getSlot("slot-consultation-tomorrow-0900")?.status).toBe("booked");
  });

  it("rejects unavailable target slots", async () => {
    const result = await rescheduleBooking(
      { bookingId: "booking-confirmed-001", targetSlotId: "slot-consultation-tomorrow-1100" },
      new Date("2026-06-30T08:00:00+09:00")
    );

    expect(result).toMatchObject({ ok: false, code: "target_slot_unavailable" });
  });
});
