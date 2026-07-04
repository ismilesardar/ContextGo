import { z } from 'zod';

export const agentProfileSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(120, { message: 'Title is too long' }),
  description: z
    .string()
    .max(500, { message: 'Description is too long' })
    .optional()
});

export type AgentProfileFormValues = z.infer<typeof agentProfileSchema>;

export const agentProfileStatusSchema = z.object({
  status: z.enum(['draft', 'published'])
});

export type AgentProfileStatusValues = z.infer<typeof agentProfileStatusSchema>;

export const agentProfileResourceTypeSchema = z.enum([
  'context',
  'instruction',
  'skill',
  'prompt_template',
  'checklist'
]);

export type AgentProfileResourceType = z.infer<
  typeof agentProfileResourceTypeSchema
>;

export const agentProfileResourceRefSchema = z.object({
  resourceType: agentProfileResourceTypeSchema,
  resourceId: z.string().min(1)
});

export const agentProfileResourcesSchema = z.object({
  resources: z.array(agentProfileResourceRefSchema)
});

export type AgentProfileResourcesFormValues = z.infer<
  typeof agentProfileResourcesSchema
>;
