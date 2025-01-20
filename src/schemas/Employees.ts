import { z } from "zod"

export const EmployeeSchema = z.object({
  profileName: z.string().min(2, "Too short").max(25, "Too long"),
  age: z.number().min(1, "Invalid").max(150, "Maximuim Age"),
  gender: z.string(),
  image: z.string().min(1, "Invalid"),
});
