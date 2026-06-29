import type { AvailabilitySlot } from "../../models/availability-slot";
import type { Booking } from "../../models/booking";

const DAY_MS = 24 * 60 * 60 * 1000;

export type PolicyDecision =
  | { allowed: true }
  | { allowed: false; code: "already_cancelled" | "inside_policy_boundary"; message: string };

export function canModifyBooking(booking: Booking, slot: AvailabilitySlot, now = new Date()): PolicyDecision {
  if (booking.status === "cancelled") {
    return { allowed: false, code: "already_cancelled", message: "이미 취소된 예약입니다." };
  }

  const startsAt = new Date(slot.startsAt);
  if (startsAt.getTime() - now.getTime() < DAY_MS) {
    return {
      allowed: false,
      code: "inside_policy_boundary",
      message: "예약은 시작 24시간 전까지만 변경할 수 있습니다."
    };
  }

  return { allowed: true };
}
