import { z } from 'zod';

export const checklistSchema = z.object({
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

export type ChecklistFormValues = z.infer<typeof checklistSchema>;

export const checklistDetailsSchema = checklistSchema.pick({
  title: true,
  description: true
});

export type ChecklistDetailsFormValues = z.infer<typeof checklistDetailsSchema>;

export const checklistStatusSchema = z.object({
  status: z.enum(['draft', 'published'])
});

export type ChecklistStatusValues = z.infer<typeof checklistStatusSchema>;
