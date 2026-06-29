import Link from "next/link";
import type { AvailabilitySlot } from "../../models/availability-slot";
import type { Booking } from "../../models/booking";
import type { Service } from "../../models/service";

type BookingCompleteScreenProps = {
  booking?: Booking;
  service?: Service;
  slot?: AvailabilitySlot;
};

export function BookingCompleteScreen({ booking, service, slot }: BookingCompleteScreenProps) {
  if (!booking) {
    return (
      <main>
        <h1>Booking not found</h1>
        <Link href="/services">Choose a service</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Booking complete</h1>
      <p data-testid="booking-summary">
        {service?.name ?? "Service"} at {slot?.startsAt ?? "selected time"}
      </p>
      <Link href={`/bookings/${booking.id}`}>Manage booking</Link>
    </main>
  );
}
