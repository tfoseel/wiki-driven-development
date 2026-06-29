import type { AvailabilitySlot } from "../../models/availability-slot";
import type { Booking } from "../../models/booking";

const DAY_MS = 24 * 60 * 60 * 1000;

export type PolicyDecision =
  | { allowed: true }
  | { allowed: false; code: "already_cancelled" | "inside_policy_boundary"; message: string };

export function canModifyBooking(booking: Booking, slot: AvailabilitySlot, now = new Date()): PolicyDecision {
  if (booking.status === "cancelled") {
    return { allowed: false, code: "already_cancelled", message: "This booking is already cancelled." };
  }

  const startsAt = new Date(slot.startsAt);
  if (startsAt.getTime() - now.getTime() < DAY_MS) {
    return {
      allowed: false,
      code: "inside_policy_boundary",
      message: "Bookings can only be changed until 24 hours before the slot starts."
    };
  }

  return { allowed: true };
}
