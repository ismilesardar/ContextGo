import { z } from 'zod';

// We pass the target slug as a parameter to make it dynamic
export const getUserAccountDeleteSchema = z
  .object({
    verification: z.string().min(1, 'Write "confirm delete account" to confirm')
  })
  .refine((data) => data.verification === 'confirm delete account', {
    message: "Phrase must exactly match 'confirm delete account'",
    path: ['verification']
  });
