/**
 * GET  /api/projects — list projects in the active workspace visible to the caller
 * POST /api/projects — create a project (creator is auto-added as project owner)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { isOrgAdmin } from '@/lib/permissions/project-access';
import { projectSchema } from '@/lib/zod-schema/project-schema';

const listHandler: ApiHandler = async (_req, { apiContext, searchParams }) => {
  const { userId, workspaceId } = apiContext;

  if (!workspaceId) {
    return NextResponse.json(
      { error: 'No active workspace', code: 'no_active_workspace' },
      { status: 400 }
    );
  }

  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const isAdmin = await isOrgAdmin(userId, workspaceId);

  const projects = await prisma.project.findMany({
    where: {
      organizationId: workspaceId,
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(search
        ? { name: { contains: search, mode: 'insensitive' as const } }
        : {}),
      ...(isAdmin ? {} : { members: { some: { userId } } })
    },
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { members: true } } }
  });

  return NextResponse.json({ projects });
};

const createHandler: ApiHandler = async (_req, { apiContext, body }) => {
  const { userId, workspaceId } = apiContext;

  if (!workspaceId) {
    return NextResponse.json(
      { error: 'No active workspace', code: 'no_active_workspace' },
      { status: 400 }
    );
  }

  if (!(await isOrgAdmin(userId, workspaceId))) {
    return NextResponse.json(
      { error: 'Only workspace owners and moderators can create projects' },
      { status: 403 }
    );
  }

  const validation = projectSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: validation.error.issues },
      { status: 400 }
    );
  }

  const existing = await prisma.project.findUnique({
    where: {
      organizationId_slug: {
        organizationId: workspaceId,
        slug: validation.data.slug
      }
    }
  });
  if (existing) {
    return NextResponse.json(
      { error: 'A project with this slug already exists', code: 'slug_taken' },
      { status: 409 }
    );
  }

  const project = await prisma.project.create({
    data: {
      ...validation.data,
      organizationId: workspaceId,
      createdById: userId,
      members: {
        create: { userId, role: 'member' }
      }
    }
  });

  return NextResponse.json({ project }, { status: 201 });
};

export const GET = withAuth(listHandler);
export const POST = withAuth(createHandler);
