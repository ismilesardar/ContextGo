import prisma from '@/lib/prisma';
import type { AgentProfileResourceType } from '@/lib/zod-schema/agent-profile-schema';

const RESOURCE_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  status: true,
  updatedAt: true
} as const;

const RESOURCE_MODELS = {
  context: () => prisma.context,
  instruction: () => prisma.instruction,
  skill: () => prisma.skill,
  prompt_template: () => prisma.promptTemplate,
  checklist: () => prisma.checklist
} as const;

export interface ResolvedAgentProfileResource {
  id: string;
  resourceType: AgentProfileResourceType;
  order: number;
  resource: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    status: string;
    updatedAt: Date;
  } | null;
}

interface RawAgentProfileResource {
  id: string;
  resourceType: string;
  resourceId: string;
  order: number;
}

/**
 * Resolves the polymorphic AgentProfileResource rows (resourceType + resourceId, no DB-level FK)
 * against each resource type's own table in one batched query per type, preserving `order`.
 * Rows whose target has since been hard-deleted resolve to `resource: null` rather than erroring,
 * since AgentProfile references are not cascade-cleaned when the underlying resource is removed.
 */
export async function resolveAgentProfileResources(
  refs: RawAgentProfileResource[]
): Promise<ResolvedAgentProfileResource[]> {
  const idsByType = new Map<string, string[]>();
  for (const ref of refs) {
    const list = idsByType.get(ref.resourceType) ?? [];
    list.push(ref.resourceId);
    idsByType.set(ref.resourceType, list);
  }

  const foundByTypeAndId = new Map<string, Map<string, any>>();
  await Promise.all(
    Array.from(idsByType.entries()).map(async ([resourceType, ids]) => {
      const getModel =
        RESOURCE_MODELS[resourceType as AgentProfileResourceType];
      if (!getModel) return;
      const rows = await (getModel() as any).findMany({
        where: { id: { in: ids } },
        select: RESOURCE_SELECT
      });
      foundByTypeAndId.set(
        resourceType,
        new Map(rows.map((row: any) => [row.id, row]))
      );
    })
  );

  return refs
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((ref) => ({
      id: ref.id,
      resourceType: ref.resourceType as AgentProfileResourceType,
      order: ref.order,
      resource:
        foundByTypeAndId.get(ref.resourceType)?.get(ref.resourceId) ?? null
    }));
}
