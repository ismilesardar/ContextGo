import { z } from 'zod';
import { projectApiKeyResourceRefSchema } from './project-api-key-schema';

/**
 * Replace-all grant list for one MCP identity within one project. An empty
 * `resources` array is valid — it's how an identity is un-granted from a project.
 */
export const setMcpIdentityGrantsSchema = z.object({
  resources: z.array(projectApiKeyResourceRefSchema)
});

export type SetMcpIdentityGrantsValues = z.infer<
  typeof setMcpIdentityGrantsSchema
>;
