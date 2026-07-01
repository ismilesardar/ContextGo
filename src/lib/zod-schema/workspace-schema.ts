import { z } from 'zod';

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Workspace name is required' })
    .max(30, { message: 'Workspace name is too long' }),
  slug: z
    .string()
    .min(1, { message: 'Workspace slug is required' })
    .max(30, { message: 'Workspace slug is too long' })
    .regex(/^[a-zA-Z0-9-_]+$/, {
      message:
        'Workspace slug can only contain letters, numbers, hyphens, and underscores'
    }),
  logo: z.string().optional()
  // logo: z
  // .string()
  // .refine(
  //   (val) => {
  //     try {
  //       new URL(val);
  //       return true;
  //     } catch {
  //       return false;
  //     }
  //   },
  //   { message: 'Workspace logo must be a valid URL' }
  // )
  // .optional()
});
