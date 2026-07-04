import { z } from 'zod';

export const skillSchema = z.object({
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

export type SkillFormValues = z.infer<typeof skillSchema>;

export const skillDetailsSchema = skillSchema.pick({
  title: true,
  description: true
});

export type SkillDetailsFormValues = z.infer<typeof skillDetailsSchema>;

export const skillStatusSchema = z.object({
  status: z.enum(['draft', 'published'])
});

export type SkillStatusValues = z.infer<typeof skillStatusSchema>;
