"use server";

import { z } from "zod";
import { addBooking, getService, getSlot, setSlotStatus } from "../lib/seed-store";
import type { Booking } from "../models/booking";

const CreateBookingInputSchema = z.object({
  serviceId: z.string().min(1),
  slotId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email()
});

type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;

export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; code: "invalid_input" | "service_inactive" | "slot_unavailable"; message: string };

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const parsed = CreateBookingInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_input", message: "Check the booking form fields." };

  const service = getService(parsed.data.serviceId);
  if (!service?.active) return { ok: false, code: "service_inactive", message: "This service is not bookable." };

  const slot = getSlot(parsed.data.slotId);
  if (!slot || slot.serviceId !== service.id || slot.status !== "available") {
    return { ok: false, code: "slot_unavailable", message: "This slot is no longer available." };
  }

  setSlotStatus(slot.id, "booked");
  const booking = addBooking({ ...parsed.data, status: "confirmed" });
  return { ok: true, booking };
}
