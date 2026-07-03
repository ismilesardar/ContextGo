/**
 * GET    /api/projects/[projectId] — fetch a project (any access required)
 * PATCH  /api/projects/[projectId] — update name/slug/description or archive status (org owner/moderator only)
 * DELETE /api/projects/[projectId] — permanent hard delete (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { projectSchema } from '@/lib/zod-schema/project-schema';
import { z } from 'zod';

const updateBodySchema = z.union([
  z.object({ status: z.enum(['active', 'archived']) }),
  projectSchema.partial()
]);

async function loadProject(projectId: string, workspaceId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
}

const getHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ project, access });
};

const patchHandler: ApiHandler = async (_req, { apiContext, params, body }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
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
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: data.status,
        archivedAt: data.status === 'archived' ? new Date() : null
      }
    });
    return NextResponse.json({ project: updated });
  }

  if (data.slug && data.slug !== project.slug) {
    const existing = await prisma.project.findUnique({
      where: {
        organizationId_slug: { organizationId: workspaceId, slug: data.slug }
      }
    });
    if (existing) {
      return NextResponse.json(
        {
          error: 'A project with this slug already exists',
          code: 'slug_taken'
        },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data
  });

  return NextResponse.json({ project: updated });
};

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await loadProject(projectId, workspaceId);
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.project.delete({ where: { id: projectId } });

  return NextResponse.json({ success: true });
};

export const GET = withAuth(getHandler);
export const PATCH = withAuth(patchHandler);
export const DELETE = withAuth(deleteHandler);
