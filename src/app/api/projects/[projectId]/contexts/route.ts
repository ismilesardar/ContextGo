/**
 * GET  /api/projects/[projectId]/contexts — list Contexts in a project (any access required)
 * POST /api/projects/[projectId]/contexts — create a Context (org owner/moderator only)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { contextSchema } from '@/lib/zod-schema/context-schema';
import { createSlug } from '@/utils/create-slug';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';
import { requireUnderLimit } from '@/lib/api/plan/require-under-limit';

const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

async function loadProject(projectId: string, workspaceId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
}

async function uniqueContextSlug(projectId: string, base: string) {
  let slug = base;
  let suffix = 1;
  while (
    await prisma.context.findUnique({
      where: { projectId_slug: { projectId, slug } }
    })
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

const listHandler: ApiHandler = async (
  _req,
  { apiContext, params, searchParams }
) => {
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

  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const contexts = await prisma.context.findMany({
    where: {
      projectId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              {
                description: { contains: search, mode: 'insensitive' as const }
              }
            ]
          }
        : {})
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    },
    orderBy: { updatedAt: 'desc' }
  });

  return NextResponse.json({ contexts });
};

const createHandler: ApiHandler = async (
  _req,
  { apiContext, params, body }
) => {
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

  const validation = contextSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { id: workspaceId },
    select: { contextsLimit: true, lastResetDate: true }
  });
  const existingCount = await prisma.context.count({
    where: {
      projectId,
      createdAt: { gte: organization?.lastResetDate ?? new Date(0) }
    }
  });
  const limitCheck = requireUnderLimit({
    currentCount: existingCount,
    limit: organization?.contextsLimit ?? 10,
    resourceLabel: 'contexts in this project'
  });
  if (!limitCheck.allowed) return limitCheck.response;

  const baseSlug = createSlug(validation.data.title) || 'context';
  const slug = await uniqueContextSlug(projectId, baseSlug);

  const context = await prisma.$transaction(async (tx) => {
    const created = await tx.context.create({
      data: {
        ...validation.data,
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
      data: { mainVersionId: v1.id },
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
    action: 'context.created',
    resourceType: 'context',
    resourceId: context.id,
    resourceTitle: context.title
  });

  return NextResponse.json({ context }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
