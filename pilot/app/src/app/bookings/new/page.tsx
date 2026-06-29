import { redirect } from "next/navigation";
import { createBooking } from "../../../actions/create-booking";
import { getService, listSlots, resetSeedStore } from "../../../lib/seed-store";
import { BookingNewScreen } from "./_components/booking-new-screen";

export default async function NewBookingPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const serviceId = Array.isArray(sp.serviceId) ? sp.serviceId[0] : sp.serviceId;
  const wddSeed = Array.isArray(sp.wddSeed) ? sp.wddSeed[0] : sp.wddSeed;
  if (wddSeed === "reset") resetSeedStore();

  const service = serviceId ? getService(serviceId) : undefined;

  async function submitBooking(formData: FormData) {
    "use server";

    const result = await createBooking({
      serviceId: serviceId ?? "",
      slotId: String(formData.get("slotId") ?? ""),
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerNote: String(formData.get("customerNote") ?? "")
    });

    if (!result.ok) redirect(`/bookings/new?serviceId=${encodeURIComponent(serviceId ?? "")}&error=${result.code}`);
    redirect(`/bookings/complete?bookingId=${encodeURIComponent(result.booking.id)}`);
  }

  return <BookingNewScreen service={service?.active ? service : undefined} slots={listSlots()} submitAction={submitBooking} />;
}
