/**
 * GET /api/projects/[projectId]/contexts/[contextId]/versions — list version history for a Context (any access required)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { getProjectAccess } from '@/lib/permissions/project-access';

const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

const listHandler: ApiHandler = async (_req, { apiContext, params }) => {
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
    select: { version: true, mainVersionId: true }
  });
  if (!context) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const versions = await prisma.contextVersion.findMany({
    where: { contextId },
    include: { createdBy: { select: AUTHOR_SELECT } },
    orderBy: { version: 'desc' }
  });

  return NextResponse.json({
    versions,
    mainVersionId: context.mainVersionId,
    latestVersion: context.version
  });
};

export const GET = withAuth(listHandler);
