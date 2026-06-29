"use server";

import { z } from "zod";
import { getBooking, getSlot, setSlotStatus, updateBooking } from "../lib/seed-store";
import { canModifyBooking } from "../lib/policies/cancellation-policy";
import type { Booking } from "../models/booking";

const CancelBookingInputSchema = z.object({
  bookingId: z.string().min(1)
});

type CancelBookingInput = z.infer<typeof CancelBookingInputSchema>;

export type CancelBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; code: "invalid_input" | "not_found" | "policy_blocked"; message: string };

export async function cancelBooking(input: CancelBookingInput, now = new Date()): Promise<CancelBookingResult> {
  const parsed = CancelBookingInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_input", message: "Missing booking id." };

  const booking = getBooking(parsed.data.bookingId);
  if (!booking) return { ok: false, code: "not_found", message: "Booking not found." };

  const slot = getSlot(booking.slotId);
  if (!slot) return { ok: false, code: "not_found", message: "Booking slot not found." };

  const decision = canModifyBooking(booking, slot, now);
  if (!decision.allowed) return { ok: false, code: "policy_blocked", message: decision.message };

  setSlotStatus(slot.id, "available");
  const updated = updateBooking(booking.id, { status: "cancelled" });
  if (!updated) return { ok: false, code: "not_found", message: "Booking not found." };
  return { ok: true, booking: updated };
}
