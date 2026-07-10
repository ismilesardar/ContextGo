import prisma from '@/lib/prisma';
import type { PublicAsset } from '@/generated/prisma/client';
import { contextSchema } from '@/lib/zod-schema/context-schema';
import { instructionSchema } from '@/lib/zod-schema/instruction-schema';
import { skillSchema } from '@/lib/zod-schema/skill-schema';
import { promptTemplateSchema } from '@/lib/zod-schema/prompt-template-schema';
import { checklistSchema } from '@/lib/zod-schema/checklist-schema';
import { createSlug } from '@/utils/create-slug';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';
import type { PublicAssetFormValues } from '@/lib/zod-schema/public-asset-schema';

type PublicAssetResourceType = PublicAssetFormValues['resourceType'];

export interface ImportPublicAssetParams {
  asset: PublicAsset;
  projectId: string;
  userId: string;
  actorName: string;
  titleOverride?: string;
}

export interface ImportPublicAssetResult {
  id: string;
  resourceType: PublicAssetResourceType;
  title: string;
}

async function uniqueSlug(
  exists: (slug: string) => Promise<boolean>,
  base: string
): Promise<string> {
  let slug = base;
  let suffix = 1;
  while (await exists(slug)) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

/**
 * Creates a new project resource from a community public asset, reusing
 * each resource type's own Zod schema and the same create-row ->
 * create-v1-version -> set-mainVersionId transaction shape every existing
 * "create" route already uses — same pattern as
 * importLibraryTemplateToProject, just sourced from PublicAsset instead of
 * LibraryTemplate.
 */
export async function importPublicAssetToProject(
  params: ImportPublicAssetParams
): Promise<ImportPublicAssetResult> {
  const { asset, projectId, userId, actorName, titleOverride } = params;

  const resourceType = asset.resourceType as PublicAssetResourceType;
  const title = titleOverride ?? asset.title;
  const content = asset.content;
  const description = asset.description ?? undefined;

  switch (resourceType) {
    case 'context': {
      const validated = contextSchema.parse({ title, description, content });
      const slug = await uniqueSlug(
        async (candidate) =>
          !!(await prisma.context.findUnique({
            where: { projectId_slug: { projectId, slug: candidate } }
          })),
        createSlug(validated.title) || 'context'
      );

      const context = await prisma.$transaction(async (tx) => {
        const created = await tx.context.create({
          data: {
            ...validated,
            projectId,
            slug,
            createdById: userId,
            updatedById: userId
          }
        });
        const v1 = await tx.contextVersion.create({
          data: {
            contextId: created.id,
            version: created.version,
            title: created.title,
            description: created.description,
            content: created.content,
            createdById: userId
          }
        });
        return tx.context.update({
          where: { id: created.id },
          data: { mainVersionId: v1.id }
        });
      });

      await recordProjectActivity({
        projectId,
        actorId: userId,
        actorName,
        action: 'context.imported_from_public_library',
        resourceType: 'context',
        resourceId: context.id,
        resourceTitle: context.title
      });

      return { id: context.id, resourceType, title: context.title };
    }

    case 'instruction': {
      const validated = instructionSchema.parse({
        title,
        description,
        content
      });
      const slug = await uniqueSlug(
        async (candidate) =>
          !!(await prisma.instruction.findUnique({
            where: { projectId_slug: { projectId, slug: candidate } }
          })),
        createSlug(validated.title) || 'instruction'
      );

      const instruction = await prisma.$transaction(async (tx) => {
        const created = await tx.instruction.create({
          data: {
            ...validated,
            projectId,
            slug,
            createdById: userId,
            updatedById: userId
          }
        });
        const v1 = await tx.instructionVersion.create({
          data: {
            instructionId: created.id,
            version: created.version,
            title: created.title,
            description: created.description,
            content: created.content,
            createdById: userId
          }
        });
        return tx.instruction.update({
          where: { id: created.id },
          data: { mainVersionId: v1.id }
        });
      });

      await recordProjectActivity({
        projectId,
        actorId: userId,
        actorName,
        action: 'instruction.imported_from_public_library',
        resourceType: 'instruction',
        resourceId: instruction.id,
        resourceTitle: instruction.title
      });

      return { id: instruction.id, resourceType, title: instruction.title };
    }

    case 'skill': {
      const validated = skillSchema.parse({ title, description, content });
      const slug = await uniqueSlug(
        async (candidate) =>
          !!(await prisma.skill.findUnique({
            where: { projectId_slug: { projectId, slug: candidate } }
          })),
        createSlug(validated.title) || 'skill'
      );

      const skill = await prisma.$transaction(async (tx) => {
        const created = await tx.skill.create({
          data: {
            ...validated,
            projectId,
            slug,
            createdById: userId,
            updatedById: userId
          }
        });
        const v1 = await tx.skillVersion.create({
          data: {
            skillId: created.id,
            version: created.version,
            title: created.title,
            description: created.description,
            content: created.content,
            createdById: userId
          }
        });
        return tx.skill.update({
          where: { id: created.id },
          data: { mainVersionId: v1.id }
        });
      });

      await recordProjectActivity({
        projectId,
        actorId: userId,
        actorName,
        action: 'skill.imported_from_public_library',
        resourceType: 'skill',
        resourceId: skill.id,
        resourceTitle: skill.title
      });

      return { id: skill.id, resourceType, title: skill.title };
    }

    case 'promptTemplate': {
      const validated = promptTemplateSchema.parse({
        title,
        description,
        content
      });
      const slug = await uniqueSlug(
        async (candidate) =>
          !!(await prisma.promptTemplate.findUnique({
            where: { projectId_slug: { projectId, slug: candidate } }
          })),
        createSlug(validated.title) || 'prompt-template'
      );

      const promptTemplate = await prisma.$transaction(async (tx) => {
        const created = await tx.promptTemplate.create({
          data: {
            ...validated,
            projectId,
            slug,
            createdById: userId,
            updatedById: userId
          }
        });
        const v1 = await tx.promptTemplateVersion.create({
          data: {
            promptTemplateId: created.id,
            version: created.version,
            title: created.title,
            description: created.description,
            content: created.content,
            createdById: userId
          }
        });
        return tx.promptTemplate.update({
          where: { id: created.id },
          data: { mainVersionId: v1.id }
        });
      });

      await recordProjectActivity({
        projectId,
        actorId: userId,
        actorName,
        action: 'prompt_template.imported_from_public_library',
        resourceType: 'prompt_template',
        resourceId: promptTemplate.id,
        resourceTitle: promptTemplate.title
      });

      return {
        id: promptTemplate.id,
        resourceType,
        title: promptTemplate.title
      };
    }

    case 'checklist': {
      const validated = checklistSchema.parse({ title, description, content });
      const slug = await uniqueSlug(
        async (candidate) =>
          !!(await prisma.checklist.findUnique({
            where: { projectId_slug: { projectId, slug: candidate } }
          })),
        createSlug(validated.title) || 'checklist'
      );

      const checklist = await prisma.$transaction(async (tx) => {
        const created = await tx.checklist.create({
          data: {
            ...validated,
            projectId,
            slug,
            createdById: userId,
            updatedById: userId
          }
        });
        const v1 = await tx.checklistVersion.create({
          data: {
            checklistId: created.id,
            version: created.version,
            title: created.title,
            description: created.description,
            content: created.content,
            createdById: userId
          }
        });
        return tx.checklist.update({
          where: { id: created.id },
          data: { mainVersionId: v1.id }
        });
      });

      await recordProjectActivity({
        projectId,
        actorId: userId,
        actorName,
        action: 'checklist.imported_from_public_library',
        resourceType: 'checklist',
        resourceId: checklist.id,
        resourceTitle: checklist.title
      });

      return { id: checklist.id, resourceType, title: checklist.title };
    }
  }
}
