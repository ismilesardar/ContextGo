import { z } from 'zod';

export const projectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Project name is required' })
    .max(60, { message: 'Project name is too long' }),
  slug: z
    .string()
    .min(1, { message: 'Project slug is required' })
    .max(60, { message: 'Project slug is too long' })
    .regex(/^[a-z0-9-]+$/, {
      message:
        'Project slug can only contain lowercase letters, numbers, and hyphens'
    }),
  description: z
    .string()
    .max(500, { message: 'Description is too long' })
    .optional()
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export const projectMemberSchema = z.object({
  userId: z.string().min(1, { message: 'A member must be selected' }),
  role: z.enum(['member', 'viewer'])
});

export type ProjectMemberFormValues = z.infer<typeof projectMemberSchema>;

export const projectMemberRoleSchema = z.object({
  role: z.enum(['member', 'viewer'])
});

export type ProjectMemberRoleValues = z.infer<typeof projectMemberRoleSchema>;
