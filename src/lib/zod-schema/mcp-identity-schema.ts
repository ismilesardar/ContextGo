import { z } from 'zod';

export const mcpIdentitySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' })
});

export type McpIdentityFormValues = z.infer<typeof mcpIdentitySchema>;
