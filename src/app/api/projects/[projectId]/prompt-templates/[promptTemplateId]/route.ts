/**
 * GET    /api/projects/[projectId]/prompt-templates/[promptTemplateId] — fetch a PromptTemplate (any access required)
 * PATCH  /api/projects/[projectId]/prompt-templates/[promptTemplateId] — update fields, or publish/unpublish via { status } (org owner/moderator only).
 *        A title/description/content edit always creates a new PromptTemplateVersion snapshot, but never
 *        auto-promotes it to Main — the live row's content/mainVersionId are unchanged until the
 *        user explicitly calls the set-main endpoint.
 * DELETE /api/projects/[projectId]/prompt-templates/[promptTemplateId] — permanent delete (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { promptTemplateSchema } from '@/lib/zod-schema/prompt-template-schema';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const updateBodySchema = z.union([
  z.object({ status: z.enum(['draft', 'published']) }),
  promptTemplateSchema.partial()
]);

async function loadPromptTemplate(
  promptTemplateId: string,
  projectId: string,
  workspaceId: string
) {
  return prisma.promptTemplate.findFirst({
    where: {
      id: promptTemplateId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const promptTemplateId = params.promptTemplateId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const promptTemplate = await prisma.promptTemplate.findFirst({
    where: {
      id: promptTemplateId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });
  if (!promptTemplate) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ promptTemplate });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const promptTemplateId = params.promptTemplateId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadPromptTemplate(
    promptTemplateId,
    projectId,
    workspaceId
  );
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const validation = updateBodySchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const data = validation.data;

  if ('status' in data) {
    const promptTemplate = await prisma.promptTemplate.update({
      where: { id: promptTemplateId },
      data: { status: data.status, updatedById: userId },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });

    await recordProjectActivity({
      projectId,
      actorId: userId,
      actorName: apiContext.session.user.name ?? 'Unknown',
      action:
        data.status === 'published'
          ? 'prompt_template.published'
          : 'prompt_template.unpublished',
      resourceType: 'prompt_template',
      resourceId: promptTemplateId,
      resourceTitle: promptTemplate.title
    });

    return NextResponse.json({ promptTemplate });
  }

  const nextVersion = existing.version + 1;

  // Every edit is captured as a new PromptTemplateVersion snapshot, but it does not
  // become the live/Main version automatically — the live PromptTemplate row (title,
  // description, content, mainVersionId) is left untouched. The user must
  // explicitly promote a version via the set-main endpoint.
  const promptTemplate = await prisma.$transaction(async (tx) => {
    await tx.promptTemplateVersion.create({
      data: {
        promptTemplateId,
        version: nextVersion,
        title: data.title ?? existing.title,
        description:
          data.description !== undefined
            ? data.description
            : existing.description,
        content: data.content ?? existing.content,
        createdById: userId
      }
    });

    return tx.promptTemplate.update({
      where: { id: promptTemplateId },
      data: {
        updatedById: userId,
        version: nextVersion
      },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'prompt_template.updated',
    resourceType: 'prompt_template',
    resourceId: promptTemplateId,
    resourceTitle: promptTemplate.title
  });

  return NextResponse.json({ promptTemplate });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const promptTemplateId = params.promptTemplateId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadPromptTemplate(
    promptTemplateId,
    projectId,
    workspaceId
  );
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.promptTemplate.delete({ where: { id: promptTemplateId } });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'prompt_template.deleted',
    resourceType: 'prompt_template',
    resourceId: promptTemplateId,
    resourceTitle: existing.title
  });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
