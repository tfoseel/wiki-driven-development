import { z } from "zod";

export const BookingStatusSchema = z.enum(["confirmed", "rescheduled", "cancelled"]);

export const CustomerNoteSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().max(500).optional());

export const BookingSchema = z.object({
  id: z.string().min(1),
  serviceId: z.string().min(1),
  slotId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  customerNote: CustomerNoteSchema,
  status: BookingStatusSchema
});

export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type Booking = z.infer<typeof BookingSchema>;
