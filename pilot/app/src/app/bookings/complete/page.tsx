import { getBooking, getService, getSlot } from "../../../lib/seed-store";
import { BookingCompleteScreen } from "../../../screens/booking-complete/screen";

export default async function BookingCompletePage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const bookingId = Array.isArray(sp.bookingId) ? sp.bookingId[0] : sp.bookingId;
  const booking = bookingId ? getBooking(bookingId) : undefined;
  return <BookingCompleteScreen booking={booking} service={booking ? getService(booking.serviceId) : undefined} slot={booking ? getSlot(booking.slotId) : undefined} />;
}
