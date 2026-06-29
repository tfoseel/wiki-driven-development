import { canModifyBooking } from "../../../lib/policies/cancellation-policy";
import { getBooking, getService, getSlot } from "../../../lib/seed-store";
import { BookingDetailScreen } from "./_components/booking-detail-screen";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = getBooking(id);
  const service = booking ? getService(booking.serviceId) : undefined;
  const slot = booking ? getSlot(booking.slotId) : undefined;
  const decision = booking && slot ? canModifyBooking(booking, slot, new Date("2026-06-30T08:00:00+09:00")) : undefined;

  return (
    <BookingDetailScreen
      booking={booking}
      service={service}
      slot={slot}
      canModify={decision?.allowed ?? false}
      policyReason={decision && !decision.allowed ? decision.message : undefined}
    />
  );
}
