import { z } from 'zod';

export const projectApiKeyResourceTypeSchema = z.enum([
  'context',
  'instruction',
  'skill',
  'prompt_template',
  'checklist',
  'agent_profile'
]);

export type ProjectApiKeyResourceType = z.infer<
  typeof projectApiKeyResourceTypeSchema
>;

export const projectApiKeyResourceRefSchema = z.object({
  resourceType: projectApiKeyResourceTypeSchema,
  resourceId: z.string().min(1)
});

export const createProjectApiKeySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name is too long' }),
  mcpIdentityId: z.string().min(1, { message: 'Select an MCP User' })
});

export type CreateProjectApiKeyValues = z.infer<
  typeof createProjectApiKeySchema
>;
