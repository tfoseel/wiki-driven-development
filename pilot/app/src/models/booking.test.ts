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

  it("stores trimmed customer notes when provided", () => {
    expect(
      BookingSchema.parse({
        id: "booking-1",
        serviceId: "consultation",
        slotId: "slot-1",
        customerName: "Alex Kim",
        customerEmail: "alex@example.com",
        customerNote: "  조용한 상담실을 부탁드립니다.  ",
        status: "confirmed"
      })
    ).toMatchObject({ customerNote: "조용한 상담실을 부탁드립니다." });
  });

  it("accepts one valid request photo", () => {
    expect(
      BookingSchema.parse({
        id: "booking-1",
        serviceId: "consultation",
        slotId: "slot-1",
        customerName: "Alex Kim",
        customerEmail: "alex@example.com",
        requestPhoto: {
          name: "room.png",
          type: "image/png",
          dataUrl: "data:image/png;base64,aGVsbG8="
        },
        status: "confirmed"
      })
    ).toMatchObject({ requestPhoto: { name: "room.png", type: "image/png" } });
  });

  it("rejects unsupported request photo types", () => {
    expect(() =>
      BookingSchema.parse({
        id: "booking-1",
        serviceId: "consultation",
        slotId: "slot-1",
        customerName: "Alex Kim",
        customerEmail: "alex@example.com",
        requestPhoto: {
          name: "notes.txt",
          type: "text/plain",
          dataUrl: "data:text/plain;base64,aGVsbG8="
        },
        status: "confirmed"
      })
    ).toThrow();
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
