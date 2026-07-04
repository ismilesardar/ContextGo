/**
 * GET    /api/projects/[projectId]/contexts/[contextId] — fetch a Context (any access required)
 * PATCH  /api/projects/[projectId]/contexts/[contextId] — update fields, or publish/unpublish via { status } (org owner/moderator only).
 *        A title/description/content edit always creates a new ContextVersion snapshot, but never
 *        auto-promotes it to Main — the live row's content/mainVersionId are unchanged until the
 *        user explicitly calls the set-main endpoint.
 * DELETE /api/projects/[projectId]/contexts/[contextId] — permanent delete (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { contextSchema } from '@/lib/zod-schema/context-schema';

const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

const updateBodySchema = z.union([
  z.object({ status: z.enum(['draft', 'published']) }),
  contextSchema.partial()
]);

async function loadContext(
  contextId: string,
  projectId: string,
  workspaceId: string
) {
  return prisma.context.findFirst({
    where: {
      id: contextId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const contextId = params.contextId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const context = await prisma.context.findFirst({
    where: {
      id: contextId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });
  if (!context) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ context });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const contextId = params.contextId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadContext(contextId, projectId, workspaceId);
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
    const context = await prisma.context.update({
      where: { id: contextId },
      data: { status: data.status, updatedById: userId },
      include: {
        createdBy: { select: AUTHOR_SELECT },
        updatedBy: { select: AUTHOR_SELECT },
        mainVersion: { select: { id: true, version: true } }
      }
    });
    return NextResponse.json({ context });
  }

  const nextVersion = existing.version + 1;

  // Every edit is captured as a new ContextVersion snapshot, but it does not
  // become the live/Main version automatically — the live Context row (title,
  // description, content, mainVersionId) is left untouched. The user must
  // explicitly promote a version via the set-main endpoint.
  const context = await prisma.$transaction(async (tx) => {
    await tx.contextVersion.create({
      data: {
        contextId,
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

    return tx.context.update({
      where: { id: contextId },
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

  return NextResponse.json({ context });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const contextId = params.contextId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const existing = await loadContext(contextId, projectId, workspaceId);
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.context.delete({ where: { id: contextId } });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
