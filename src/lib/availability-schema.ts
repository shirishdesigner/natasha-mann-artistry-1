import { z } from "zod";

export const availabilitySchema = z.object({
  service: z.string().trim().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
