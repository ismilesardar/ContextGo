/**
 * POST /api/library/templates/[templateId]/import — create a new project
 * resource (Context/Instruction/Skill/PromptTemplate/Checklist) from a cached
 * library template. Gated by `canManageProject` for the submitted
 * `projectId` — identical rule to every existing "create a resource" route.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { libraryImportSchema } from '@/lib/zod-schema/library-schema';
import { importLibraryTemplateToProject } from '@/lib/api/library/import-template';

const importHandler: ApiHandler = async (
  _req,
  { apiContext, params, body }
) => {
  const { userId, workspaceId } = apiContext;
  const templateId = params.templateId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const validation = libraryImportSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const { projectId, resourceType, titleOverride, includeAttribution } =
    validation.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const template = await prisma.libraryTemplate.findUnique({
    where: { id: templateId }
  });
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const result = await importLibraryTemplateToProject({
    template,
    projectId,
    resourceType,
    userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    titleOverride,
    includeAttribution
  });

  return NextResponse.json({ resource: result }, { status: 201 });
};

export const POST = withAuth(importHandler);
