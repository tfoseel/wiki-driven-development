import { describe, expect, it } from "vitest";
import { BookingSchema } from "./booking";

describe("BookingSchema", () => {
  it("accepts confirmed bookings with valid contact details", () => {
    expect(
      BookingSchema.parse({
        id: "booking-1",
        serviceId: "consultation",
        slotId: "slot-1",
        customerName: "Alex Kim",
        customerEmail: "alex@example.com",
        status: "confirmed"
      })
    ).toMatchObject({ status: "confirmed" });
  });

  it("rejects invalid emails", () => {
    expect(() =>
      BookingSchema.parse({
        id: "booking-1",
        serviceId: "consultation",
        slotId: "slot-1",
        customerName: "Alex Kim",
        customerEmail: "not-an-email",
        status: "confirmed"
      })
    ).toThrow();
  });
});
