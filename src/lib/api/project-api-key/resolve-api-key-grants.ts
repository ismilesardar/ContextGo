import prisma from '@/lib/prisma';
import { resolveAgentProfileResources } from '@/lib/api/resolve-agent-profile-resources';
import type { ProjectApiKeyResourceType } from '@/lib/zod-schema/project-api-key-schema';

export type ApiKeyGrants = Record<ProjectApiKeyResourceType, Set<string>>;

function emptyGrants(): ApiKeyGrants {
  return {
    context: new Set(),
    instruction: new Set(),
    skill: new Set(),
    prompt_template: new Set(),
    checklist: new Set(),
    agent_profile: new Set()
  };
}

/**
 * Resolves what a given API key can actually see, *live* at request time — a key has
 * no grants of its own; it's a bearer credential for an `McpIdentity`, and everything
 * it can see is whatever that identity is currently granted in this project. If an
 * admin changes the identity's grants later, every key issued for it reflects the
 * change immediately, with no need to reissue the key.
 *
 * Also folds in, for any directly-granted Agent Profile, that profile's own bundled
 * *published* member resources — so granting a whole profile behaves as granting
 * everything it bundles, without ticking each item individually.
 */
export async function resolveApiKeyGrants(
  apiKeyId: string
): Promise<ApiKeyGrants> {
  const apiKey = await prisma.projectApiKey.findUnique({
    where: { id: apiKeyId },
    select: { projectId: true, mcpIdentityId: true }
  });
  if (!apiKey) return emptyGrants();

  const rows = await prisma.mcpIdentityResourceGrant.findMany({
    where: { mcpIdentityId: apiKey.mcpIdentityId, projectId: apiKey.projectId }
  });

  const grants = emptyGrants();
  for (const row of rows) {
    const type = row.resourceType as ProjectApiKeyResourceType;
    grants[type]?.add(row.resourceId);
  }

  const agentProfileIds = Array.from(grants.agent_profile);
  if (agentProfileIds.length > 0) {
    const profiles = await prisma.agentProfile.findMany({
      where: { id: { in: agentProfileIds } },
      include: { resources: { orderBy: { order: 'asc' } } }
    });

    for (const profile of profiles) {
      const resolved = await resolveAgentProfileResources(profile.resources);
      for (const ref of resolved) {
        if (ref.resource && ref.resource.status === 'published') {
          grants[ref.resourceType]?.add(ref.resource.id);
        }
      }
    }
  }

  return grants;
}
