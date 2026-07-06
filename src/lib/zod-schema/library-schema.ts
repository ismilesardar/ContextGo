import { z } from 'zod';

export const libraryResourceTypeSchema = z.enum([
  'context',
  'instruction',
  'skill',
  'promptTemplate',
  'checklist'
]);

export const libraryImportSchema = z.object({
  projectId: z.string().min(1, { message: 'Project is required' }),
  resourceType: libraryResourceTypeSchema,
  titleOverride: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(120, { message: 'Title is too long' })
    .optional(),
  includeAttribution: z.boolean().default(true)
});

export type LibraryImportValues = z.infer<typeof libraryImportSchema>;
