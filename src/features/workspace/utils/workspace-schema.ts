import { z } from 'zod';

// Assuming InvitationStatus is an enum or union,
// replace this with your actual status definition
const InvitationStatusSchema = z.enum([
  'pending',
  'accepted',
  'declined',
  'expired'
]);

const RoleSchema = z.enum(['owner', 'moderator', 'member', 'viewer']);

export const activeWorkspaceSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'workspace name must be at least 3 characters' })
    .max(32, { message: 'workspace name must be under 32 characters' }),
  slug: z
    .string()
    .min(3, { message: 'workspace slug must be at least 3 characters' })
    .max(48, { message: 'workspace slug must be under 32 characters' })
    .regex(
      /^[a-z0-9-]+$/,
      'Slugs can only contain lowercase letters, numbers, and hyphens'
    )
    .refine((s) => !s.startsWith('-') && !s.endsWith('-'), {
      message: 'Slug cannot start or end with a hyphen'
    }),
  createdAt: z.date(),
  logo: z.string().optional(),
  metadata: z.any().optional(),
  members: z
    .array(
      z.object({
        id: z.string(),
        organizationId: z.string(),
        role: RoleSchema,
        createdAt: z.date(),
        userId: z.string(),
        user: z.object({
          id: z.string(),
          email: z.string().email(),
          name: z.string(),
          image: z.string().optional()
        })
      })
    )
    .optional(),
  invitations: z
    .array(
      z.object({
        id: z.string(),
        organizationId: z.string(),
        email: z.string().email(),
        role: RoleSchema,
        status: InvitationStatusSchema,
        inviterId: z.string(),
        expiresAt: z.date(),
        createdAt: z.date()
      })
    )
    .optional()
});
