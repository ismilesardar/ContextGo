import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import prisma from '@/lib/prisma';
import { resolveAgentProfileResources } from '@/lib/api/resolve-agent-profile-resources';
import type { ApiKeyGrants } from '@/lib/api/project-api-key/resolve-api-key-grants';
import {
  CONTENT_RESOURCE_TYPES,
  RESOURCE_MODELS,
  serializeContentResource,
  type ContentResourceType
} from '@/lib/api/mcp/resource-models';

function jsonContent(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }]
  };
}

function errorContent(message: string) {
  return { content: [{ type: 'text' as const, text: message }], isError: true };
}

/**
 * Builds a fresh, stateless McpServer scoped to exactly one project's key grants.
 * The key's projectId/grants are resolved and verified before this is ever called —
 * tools never accept a projectId argument, so a valid key for one project can never
 * be used to query another project's data.
 */
export function buildMcpServer(projectId: string, grants: ApiKeyGrants) {
  const server = new McpServer({
    name: 'primiso-project-mcp',
    version: '1.0.0'
  });

  server.registerTool(
    'list_resources',
    {
      title: 'List resources',
      description:
        "List published resources this key is granted access to, optionally filtered to one resource type. Returns each resource's live (Main version) content.",
      inputSchema: {
        resourceType: z.enum(CONTENT_RESOURCE_TYPES).optional()
      }
    },
    async ({ resourceType }) => {
      const types: ContentResourceType[] = resourceType
        ? [resourceType]
        : [...CONTENT_RESOURCE_TYPES];

      const resources = [];
      for (const type of types) {
        const ids = Array.from(grants[type]);
        if (ids.length === 0) continue;
        const rows = await (RESOURCE_MODELS[type]() as any).findMany({
          where: { id: { in: ids }, projectId, status: 'published' },
          include: { mainVersion: true }
        });
        resources.push(
          ...rows.map((row: any) => serializeContentResource(type, row))
        );
      }

      return jsonContent({ resources });
    }
  );

  server.registerTool(
    'get_resource',
    {
      title: 'Get resource',
      description:
        'Get a single published resource by type and slug. Only resources this key is granted access to are visible.',
      inputSchema: {
        resourceType: z.enum(CONTENT_RESOURCE_TYPES),
        slug: z.string()
      }
    },
    async ({ resourceType, slug }) => {
      const ids = Array.from(grants[resourceType]);
      if (ids.length === 0) return errorContent('Resource not found');

      const row = await (RESOURCE_MODELS[resourceType]() as any).findFirst({
        where: { id: { in: ids }, projectId, slug, status: 'published' },
        include: { mainVersion: true }
      });
      if (!row) return errorContent('Resource not found');

      return jsonContent(serializeContentResource(resourceType, row));
    }
  );

  server.registerTool(
    'list_agent_profiles',
    {
      title: 'List agent profiles',
      description:
        'List published Agent Profiles this key is directly granted access to (index only — use get_agent_profile for its bundled resources).'
    },
    async () => {
      const ids = Array.from(grants.agent_profile);
      if (ids.length === 0) return jsonContent({ agentProfiles: [] });

      const profiles = await prisma.agentProfile.findMany({
        where: { id: { in: ids }, projectId, status: 'published' },
        select: { id: true, title: true, slug: true, description: true }
      });

      return jsonContent({ agentProfiles: profiles });
    }
  );

  server.registerTool(
    'get_agent_profile',
    {
      title: 'Get agent profile',
      description:
        "Get a published Agent Profile's bundled resources by slug (Main version content per resource). The profile itself must be directly granted to this key — unpublished or deleted member resources are silently omitted.",
      inputSchema: { slug: z.string() }
    },
    async ({ slug }) => {
      const ids = Array.from(grants.agent_profile);
      if (ids.length === 0) return errorContent('Agent profile not found');

      const profile = await prisma.agentProfile.findFirst({
        where: { id: { in: ids }, projectId, slug, status: 'published' },
        include: { resources: { orderBy: { order: 'asc' } } }
      });
      if (!profile) return errorContent('Agent profile not found');

      const resolved = await resolveAgentProfileResources(profile.resources);
      const publishedIdsByType: Record<ContentResourceType, string[]> = {
        context: [],
        instruction: [],
        skill: [],
        prompt_template: [],
        checklist: []
      };
      for (const ref of resolved) {
        if (ref.resource && ref.resource.status === 'published') {
          publishedIdsByType[ref.resourceType].push(ref.resource.id);
        }
      }

      const resources = [];
      for (const type of CONTENT_RESOURCE_TYPES) {
        const ids = publishedIdsByType[type];
        if (ids.length === 0) continue;
        const rows = await (RESOURCE_MODELS[type]() as any).findMany({
          where: { id: { in: ids } },
          include: { mainVersion: true }
        });
        resources.push(
          ...rows.map((row: any) => serializeContentResource(type, row))
        );
      }

      return jsonContent({
        agentProfile: {
          id: profile.id,
          title: profile.title,
          slug: profile.slug,
          description: profile.description
        },
        resources
      });
    }
  );

  return server;
}
