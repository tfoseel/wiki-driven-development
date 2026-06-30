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

  it("stores trimmed customer notes with the booking", async () => {
    const result = await createBooking({
      serviceId: "follow-up",
      slotId: "slot-follow-up-tomorrow-1400",
      customerName: "Jamie Lee",
      customerEmail: "jamie@example.com",
      customerNote: "  지난 상담 자료를 먼저 확인해 주세요.  "
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.booking.customerNote).toBe("지난 상담 자료를 먼저 확인해 주세요.");
    expect(getBooking(result.booking.id)?.customerNote).toBe("지난 상담 자료를 먼저 확인해 주세요.");
  });

  it("stores a valid request photo with the booking", async () => {
    const result = await createBooking({
      serviceId: "follow-up",
      slotId: "slot-follow-up-tomorrow-1400",
      customerName: "Jamie Lee",
      customerEmail: "jamie@example.com",
      requestPhoto: {
        name: "desk.png",
        type: "image/png",
        dataUrl: "data:image/png;base64,aGVsbG8="
      }
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.booking.requestPhoto).toMatchObject({ name: "desk.png", type: "image/png" });
    expect(getBooking(result.booking.id)?.requestPhoto?.dataUrl).toBe("data:image/png;base64,aGVsbG8=");
  });

  it("rejects unsupported request photo types", async () => {
    const result = await createBooking({
      serviceId: "follow-up",
      slotId: "slot-follow-up-tomorrow-1400",
      customerName: "Jamie Lee",
      customerEmail: "jamie@example.com",
      requestPhoto: {
        name: "notes.txt",
        type: "text/plain",
        dataUrl: "data:text/plain;base64,aGVsbG8="
      }
    });

    expect(result).toMatchObject({ ok: false, code: "invalid_input" });
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
