import { beforeEach, describe, expect, it } from "vitest";
import { createBooking } from "./create-booking";
import { getBooking, getSlot, resetSeedStore } from "../lib/seed-store";

describe("createBooking", () => {
  beforeEach(() => resetSeedStore());

  it("creates a confirmed booking and books the slot", async () => {
    const result = await createBooking({
      serviceId: "consultation",
      slotId: "slot-consultation-tomorrow-0900",
      customerName: "Jamie Lee",
      customerEmail: "jamie@example.com"
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(getBooking(result.booking.id)?.status).toBe("confirmed");
    expect(getSlot("slot-consultation-tomorrow-0900")?.status).toBe("booked");
  });

  it("rejects duplicate submit after the slot is booked", async () => {
    await createBooking({
      serviceId: "consultation",
      slotId: "slot-consultation-tomorrow-0900",
      customerName: "Jamie Lee",
      customerEmail: "jamie@example.com"
    });

    const second = await createBooking({
      serviceId: "consultation",
      slotId: "slot-consultation-tomorrow-0900",
      customerName: "Jamie Lee",
      customerEmail: "jamie@example.com"
    });

    expect(second).toMatchObject({ ok: false, code: "slot_unavailable" });
  });
});
