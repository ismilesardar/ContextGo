import { z } from 'zod';

export const publicAssetResourceTypeSchema = z.enum([
  'context',
  'instruction',
  'skill',
  'promptTemplate',
  'checklist'
]);

export const publicAssetSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(120, { message: 'Title is too long' }),
  description: z
    .string()
    .max(500, { message: 'Description is too long' })
    .optional(),
  content: z.string().min(1, { message: 'Content is required' }),
  resourceType: publicAssetResourceTypeSchema
});

export type PublicAssetFormValues = z.infer<typeof publicAssetSchema>;

export const publicAssetUpdateSchema = publicAssetSchema
  .omit({ resourceType: true })
  .partial();

export type PublicAssetUpdateValues = z.infer<typeof publicAssetUpdateSchema>;

export const publicAssetImportSchema = z.object({
  projectId: z.string().min(1, { message: 'Project is required' }),
  titleOverride: z.string().max(120).optional()
});

export type PublicAssetImportValues = z.infer<typeof publicAssetImportSchema>;
