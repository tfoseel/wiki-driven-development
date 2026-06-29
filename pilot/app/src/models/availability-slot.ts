import { z } from "zod";

export const SlotStatusSchema = z.enum(["available", "booked", "unavailable"]);

export const AvailabilitySlotSchema = z.object({
  id: z.string().min(1),
  serviceId: z.string().min(1),
  startsAt: z.string().datetime({ offset: true }),
  status: SlotStatusSchema
});

export type SlotStatus = z.infer<typeof SlotStatusSchema>;
export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;
