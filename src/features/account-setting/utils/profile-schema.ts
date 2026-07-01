import * as z from 'zod';
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const profileSchema = z.object({
  id: z.boolean(),
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(32, { message: 'Name must be under 32 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .regex(emailRegex, { message: 'Email must be a valid format' }),
  defaultWorkspace: z.string(),
  emailVerified: z.boolean(),
  image: z.string(),
  role: z.string(),
  twoFactorEnabled: z.string()
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
