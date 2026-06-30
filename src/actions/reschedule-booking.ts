"use server";

import { z } from "zod";
import { getBooking, getSlot, setSlotStatus, updateBooking } from "../lib/seed-store";
import { canModifyBooking } from "../lib/policies/cancellation-policy";
import type { Booking } from "../models/booking";

const RescheduleBookingInputSchema = z.object({
  bookingId: z.string().min(1),
  targetSlotId: z.string().min(1)
});

type RescheduleBookingInput = z.infer<typeof RescheduleBookingInputSchema>;

export type RescheduleBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; code: "invalid_input" | "not_found" | "policy_blocked" | "target_slot_unavailable"; message: string };

export async function rescheduleBooking(input: RescheduleBookingInput, now = new Date()): Promise<RescheduleBookingResult> {
  const parsed = RescheduleBookingInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_input", message: "일정 변경 입력값이 부족합니다." };

  const booking = getBooking(parsed.data.bookingId);
  if (!booking) return { ok: false, code: "not_found", message: "예약을 찾을 수 없습니다." };

  const currentSlot = getSlot(booking.slotId);
  if (!currentSlot) return { ok: false, code: "not_found", message: "현재 슬롯을 찾을 수 없습니다." };

  const decision = canModifyBooking(booking, currentSlot, now);
  if (!decision.allowed) return { ok: false, code: "policy_blocked", message: decision.message };

  const targetSlot = getSlot(parsed.data.targetSlotId);
  if (!targetSlot || targetSlot.status !== "available" || targetSlot.serviceId !== booking.serviceId) {
    return { ok: false, code: "target_slot_unavailable", message: "대상 시간은 예약할 수 없습니다." };
  }

  setSlotStatus(currentSlot.id, "available");
  setSlotStatus(targetSlot.id, "booked");
  const updated = updateBooking(booking.id, { slotId: targetSlot.id, status: "rescheduled" });
  if (!updated) return { ok: false, code: "not_found", message: "예약을 찾을 수 없습니다." };
  return { ok: true, booking: updated };
}
