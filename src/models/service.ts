import { z } from "zod";

export const ServiceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  durationMinutes: z.number().int().positive(),
  active: z.boolean()
});

export type Service = z.infer<typeof ServiceSchema>;
