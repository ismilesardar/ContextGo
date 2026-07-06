import prisma from '@/lib/prisma';
import type { ProjectApiKeyResourceType } from '@/lib/zod-schema/project-api-key-schema';

const RESOURCE_MODELS = {
  context: () => prisma.context,
  instruction: () => prisma.instruction,
  skill: () => prisma.skill,
  prompt_template: () => prisma.promptTemplate,
  checklist: () => prisma.checklist,
  agent_profile: () => prisma.agentProfile
} as const;

/**
 * Confirms every submitted {resourceType, resourceId} grant actually belongs to this
 * project, so a key can never be scoped to another project's resources by id-guessing.
 */
export async function allResourcesBelongToProject(
  refs: { resourceType: ProjectApiKeyResourceType; resourceId: string }[],
  projectId: string
): Promise<boolean> {
  const idsByType = new Map<string, string[]>();
  for (const ref of refs) {
    const list = idsByType.get(ref.resourceType) ?? [];
    list.push(ref.resourceId);
    idsByType.set(ref.resourceType, list);
  }

  const results = await Promise.all(
    Array.from(idsByType.entries()).map(async ([resourceType, ids]) => {
      const getModel =
        RESOURCE_MODELS[resourceType as ProjectApiKeyResourceType];
      if (!getModel) return false;
      const count = await (getModel() as any).count({
        where: { id: { in: ids }, projectId }
      });
      return count === ids.length;
    })
  );

  return results.every(Boolean);
}
