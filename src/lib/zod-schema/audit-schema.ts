import * as z from 'zod/v4';
import { workspaceSchema } from './workspace-schema';

// Schema that represents the audit log schema
export const auditLogSchemaTB = z.object({
  id: z.string(),
  timestamp: z.string(),
  workspaceId: z.string(),
  // programId: z.string(),
  action: z.string(),
  actorId: z.string(),
  actorType: z.string(),
  actorName: z.string(),
  description: z.string(),
  targets: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  metadata: z.string().nullable()
});

const actionSchema = z.enum([
  // Program
  'workspace.created',
  'workspace.updated',
  // MCP identities (org-level service accounts for MCP access)
  'mcp_identity.created',
  'mcp_identity.deleted'
]);

export const auditLogTarget = z.union([
  z.object({
    type: z.literal('workspace'),
    id: z.string(),
    metadata: workspaceSchema
      .pick({
        name: true,
        slug: true,
        logo: true
      })
      .optional()
  }),

  z.object({
    type: z.literal('mcp_identity'),
    id: z.string(),
    metadata: z.object({ name: z.string() }).optional()
  })

  //   z.object({
  //     type: z.literal("reward"),
  //     id: z.string(),
  //     metadata: RewardSchema.pick({
  //       event: true,
  //       type: true,
  //       amountInCents: true,
  //       amountInPercentage: true,
  //       maxDuration: true,
  //     }),
  //   }),
]);

export const recordAuditLogInputSchema = z.object({
  workspaceId: z.string(),
  // programId: z.string(),
  action: actionSchema,
  actorId: z.string(),
  actorType: z.string().nullish(),
  actorName: z.string().nullish(),
  description: z.string().nullish(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  targets: z.array(auditLogTarget).nullish(),
  metadata: z.record(z.string(), z.any()).nullish(),
  req: z.instanceof(Request).nullish()
});
