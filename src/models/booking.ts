import { z } from "zod";

export const BookingStatusSchema = z.enum(["confirmed", "rescheduled", "cancelled"]);
export const RequestPhotoTypeSchema = z.enum(["image/png", "image/jpeg", "image/webp"]);

export const CustomerNoteSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().max(500).optional());

export const BookingRequestPhotoSchema = z
  .object({
    name: z.string().min(1).max(120),
    type: RequestPhotoTypeSchema,
    dataUrl: z.string().min(1)
  })
  .refine((photo) => photo.dataUrl.startsWith(`data:${photo.type};base64,`), {
    message: "Photo data URL must match the MIME type"
  });

export const BookingSchema = z.object({
  id: z.string().min(1),
  serviceId: z.string().min(1),
  slotId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.email(),
  customerNote: CustomerNoteSchema,
  requestPhoto: BookingRequestPhotoSchema.optional(),
  status: BookingStatusSchema
});

export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type BookingRequestPhoto = z.infer<typeof BookingRequestPhotoSchema>;
export type Booking = z.infer<typeof BookingSchema>;
