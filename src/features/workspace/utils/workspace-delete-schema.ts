import { z } from 'zod';

// We pass the target slug as a parameter to make it dynamic
export const getDeleteWorkspaceSchema = (targetSlug: string) =>
  z
    .object({
      slug: z.string().min(1, 'Slug is required'),
      phrase: z.string().min(1, 'Confirmation phrase is required')
    })
    .refine((data) => data.slug === targetSlug, {
      message: `Slug must exactly match "${targetSlug}"`,
      path: ['slug']
    })
    .refine((data) => data.phrase === 'confirm delete workspace', {
      message: "Phrase must exactly match 'confirm delete workspace'",
      path: ['phrase']
    });
