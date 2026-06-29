import { z } from "zod";

export const BookingStatusSchema = z.enum(["confirmed", "rescheduled", "cancelled"]);

export const BookingSchema = z.object({
  id: z.string().min(1),
  serviceId: z.string().min(1),
  slotId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  status: BookingStatusSchema
});

export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type Booking = z.infer<typeof BookingSchema>;
