/**
 * GET    /api/projects/[projectId]/checklists/[checklistId] — fetch a Checklist (any access required)
 * PATCH  /api/projects/[projectId]/checklists/[checklistId] — update fields, or publish/unpublish via { status } (org owner/moderator only).
 *        A title/description/content edit always creates a new ChecklistVersion snapshot, but never
 *        auto-promotes it to Main — the live row's content/mainVersionId are unchanged until the
 *        user explicitly calls the set-main endpoint.
 * DELETE /api/projects/[projectId]/checklists/[checklistId] — permanent delete (org owner/moderator only)
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
import { checklistSchema } from '@/lib/zod-schema/checklist-schema';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const updateBodySchema = z.union([
  z.object({ status: z.enum(['draft', 'published']) }),
  checklistSchema.partial()
]);

async function loadChecklist(
  checklistId: string,
  projectId: string,
  workspaceId: string
) {
  return prisma.checklist.findFirst({
    where: {
      id: checklistId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const checklistId = params.checklistId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const checklist = await prisma.checklist.findFirst({
    where: {
      id: checklistId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });
  if (!checklist) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ checklist });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const checklistId = params.checklistId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadChecklist(checklistId, projectId, workspaceId);
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
    const checklist = await prisma.checklist.update({
      where: { id: checklistId },
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
          ? 'checklist.published'
          : 'checklist.unpublished',
      resourceType: 'checklist',
      resourceId: checklistId,
      resourceTitle: checklist.title
    });

    return NextResponse.json({ checklist });
  }

  const nextVersion = existing.version + 1;

  // Every edit is captured as a new ChecklistVersion snapshot, but it does not
  // become the live/Main version automatically — the live Checklist row (title,
  // description, content, mainVersionId) is left untouched. The user must
  // explicitly promote a version via the set-main endpoint.
  const checklist = await prisma.$transaction(async (tx) => {
    await tx.checklistVersion.create({
      data: {
        checklistId,
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

    return tx.checklist.update({
      where: { id: checklistId },
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
    action: 'checklist.updated',
    resourceType: 'checklist',
    resourceId: checklistId,
    resourceTitle: checklist.title
  });

  return NextResponse.json({ checklist });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const checklistId = params.checklistId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadChecklist(checklistId, projectId, workspaceId);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.checklist.delete({ where: { id: checklistId } });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'checklist.deleted',
    resourceType: 'checklist',
    resourceId: checklistId,
    resourceTitle: existing.title
  });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
