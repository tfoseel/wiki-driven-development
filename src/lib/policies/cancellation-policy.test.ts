import { describe, expect, it } from "vitest";
import { canModifyBooking } from "./cancellation-policy";
import type { Booking } from "../../models/booking";
import type { AvailabilitySlot } from "../../models/availability-slot";

const booking: Booking = {
  id: "booking-1",
  serviceId: "consultation",
  slotId: "slot-1",
  customerName: "Alex Kim",
  customerEmail: "alex@example.com",
  status: "confirmed"
};

const slot = (startsAt: string): AvailabilitySlot => ({
  id: "slot-1",
  serviceId: "consultation",
  startsAt,
  status: "booked"
});

describe("canModifyBooking", () => {
  it("allows modification exactly 24 hours before the slot", () => {
    expect(
      canModifyBooking(booking, slot("2026-07-02T09:00:00+09:00"), new Date("2026-07-01T09:00:00+09:00"))
    ).toMatchObject({ allowed: true });
  });

  it("blocks modification less than 24 hours before the slot", () => {
    expect(
      canModifyBooking(booking, slot("2026-07-02T08:59:00+09:00"), new Date("2026-07-01T09:00:00+09:00"))
    ).toMatchObject({ allowed: false });
  });
});
