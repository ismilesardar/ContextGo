import { z } from 'zod';

export const promptTemplateSchema = z.object({
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

export type PromptTemplateFormValues = z.infer<typeof promptTemplateSchema>;

export const promptTemplateDetailsSchema = promptTemplateSchema.pick({
  title: true,
  description: true
});

export type PromptTemplateDetailsFormValues = z.infer<
  typeof promptTemplateDetailsSchema
>;

export const promptTemplateStatusSchema = z.object({
  status: z.enum(['draft', 'published'])
});

export type PromptTemplateStatusValues = z.infer<
  typeof promptTemplateStatusSchema
>;
