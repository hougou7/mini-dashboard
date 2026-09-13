import { z } from "zod";

export const userInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("A valid email is required").max(255),
});

export type UserInput = z.infer<typeof userInputSchema>;
