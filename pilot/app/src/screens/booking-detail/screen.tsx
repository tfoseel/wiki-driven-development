import type { AvailabilitySlot } from "../../models/availability-slot";
import type { Booking } from "../../models/booking";
import type { Service } from "../../models/service";

type BookingDetailScreenProps = {
  booking?: Booking;
  service?: Service;
  slot?: AvailabilitySlot;
  canModify: boolean;
  policyReason?: string;
};

export function BookingDetailScreen({ booking, service, slot, canModify, policyReason }: BookingDetailScreenProps) {
  if (!booking) {
    return (
      <main>
        <h1>Booking not found</h1>
        <p data-testid="booking-not-found">Check the booking link and try again.</p>
      </main>
    );
  }

  const inactive = booking.status === "cancelled";

  return (
    <main>
      <h1>Booking detail</h1>
      <p data-testid="booking-status">{booking.status}</p>
      <p>{service?.name ?? booking.serviceId}</p>
      <p>{slot?.startsAt ?? booking.slotId}</p>
      {inactive ? <p data-testid="inactive-booking">This booking is cancelled.</p> : null}
      {!inactive && canModify ? (
        <div>
          <button type="button">Reschedule booking</button>
          <button type="button">Cancel booking</button>
        </div>
      ) : null}
      {!inactive && !canModify ? <p data-testid="policy-blocked">{policyReason}</p> : null}
    </main>
  );
}
