import { z } from "zod"

export const ContainerSchema = z.object({
  name: z.string().min(2, "Too short").max(25, "Too long"),
  category: z.string().min(2, "Too short").max(25, "Too long"),
  description: z.string().optional(),
  logo: z.string().min(1, "Invalid").optional()
});
