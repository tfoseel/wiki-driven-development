import { redirect } from "next/navigation";
import { Buffer } from "node:buffer";
import { createBooking } from "../../../actions/create-booking";
import { getService, listSlots, resetSeedStore } from "../../../lib/seed-store";
import { BookingNewScreen } from "./_components/booking-new-screen";

const supportedPhotoTypes = ["image/png", "image/jpeg", "image/webp"] as const;
const maxRequestPhotoBytes = 512 * 1024;

async function requestPhotoFromFormData(formData: FormData) {
  const value = formData.get("requestPhoto");
  if (!(value instanceof File) || value.size === 0) return undefined;
  if (!supportedPhotoTypes.includes(value.type as (typeof supportedPhotoTypes)[number])) return "invalid";
  if (value.size > maxRequestPhotoBytes) return "invalid";

  const bytes = Buffer.from(await value.arrayBuffer());
  return {
    name: value.name,
    type: value.type as (typeof supportedPhotoTypes)[number],
    dataUrl: `data:${value.type};base64,${bytes.toString("base64")}`
  };
}

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

    const requestPhoto = await requestPhotoFromFormData(formData);
    if (requestPhoto === "invalid") {
      redirect(`/bookings/new?serviceId=${encodeURIComponent(serviceId ?? "")}&error=invalid_input`);
    }

    const result = await createBooking({
      serviceId: serviceId ?? "",
      slotId: String(formData.get("slotId") ?? ""),
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerNote: String(formData.get("customerNote") ?? ""),
      requestPhoto
    });

    if (!result.ok) redirect(`/bookings/new?serviceId=${encodeURIComponent(serviceId ?? "")}&error=${result.code}`);
    redirect(`/bookings/complete?bookingId=${encodeURIComponent(result.booking.id)}`);
  }

  return <BookingNewScreen service={service?.active ? service : undefined} slots={listSlots()} submitAction={submitBooking} />;
}
