import { z } from 'zod';

export const contextSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(120, { message: 'Title is too long' }),
  description: z
    .string()
    .max(500, { message: 'Description is too long' })
    .optional(),
  content: z.string().min(1, { message: 'Content is required' })
});

export type ContextFormValues = z.infer<typeof contextSchema>;

export const contextDetailsSchema = contextSchema.pick({
  title: true,
  description: true
});

export type ContextDetailsFormValues = z.infer<typeof contextDetailsSchema>;

export const contextStatusSchema = z.object({
  status: z.enum(['draft', 'published'])
});

export type ContextStatusValues = z.infer<typeof contextStatusSchema>;
