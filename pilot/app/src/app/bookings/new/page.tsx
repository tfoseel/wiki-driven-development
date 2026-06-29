import { getService, listSlots } from "../../../lib/seed-store";
import { BookingNewScreen } from "./_components/booking-new-screen";

export default async function NewBookingPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const serviceId = Array.isArray(sp.serviceId) ? sp.serviceId[0] : sp.serviceId;
  const service = serviceId ? getService(serviceId) : undefined;
  return <BookingNewScreen service={service?.active ? service : undefined} slots={listSlots()} />;
}
