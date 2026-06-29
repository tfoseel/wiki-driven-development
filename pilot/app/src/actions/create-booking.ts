"use server";

import { z } from "zod";
import { addBooking, getService, getSlot, setSlotStatus } from "../lib/seed-store";
import { CustomerNoteSchema, type Booking } from "../models/booking";

const CreateBookingInputSchema = z.object({
  serviceId: z.string().min(1),
  slotId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  customerNote: CustomerNoteSchema
});

type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;

export type CreateBookingResult =
  | { ok: true; booking: Booking }
  | { ok: false; code: "invalid_input" | "service_inactive" | "slot_unavailable"; message: string };

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  const parsed = CreateBookingInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, code: "invalid_input", message: "예약 입력값을 확인하세요." };

  const service = getService(parsed.data.serviceId);
  if (!service?.active) return { ok: false, code: "service_inactive", message: "이 서비스는 예약할 수 없습니다." };

  const slot = getSlot(parsed.data.slotId);
  if (!slot || slot.serviceId !== service.id || slot.status !== "available") {
    return { ok: false, code: "slot_unavailable", message: "이 시간은 더 이상 예약할 수 없습니다." };
  }

  setSlotStatus(slot.id, "booked");
  const booking = addBooking({ ...parsed.data, status: "confirmed" });
  return { ok: true, booking };
}
