/**
 * GET /api/projects/[projectId]/activity/summary — aggregate counters for the
 * Activity page (total activities, most active resource type, most active
 * member). Same access rule as the activity feed itself: any project access.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { getProjectAccess } from '@/lib/permissions/project-access';

const summaryHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: workspaceId, deletedAt: null }
  });
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const [total, topResourceTypeGroup, topActorGroup] = await Promise.all([
    prisma.projectActivity.count({ where: { projectId } }),
    prisma.projectActivity.groupBy({
      by: ['resourceType'],
      where: { projectId, resourceType: { not: null } },
      _count: { resourceType: true },
      orderBy: { _count: { resourceType: 'desc' } },
      take: 1
    }),
    prisma.projectActivity.groupBy({
      by: ['actorId', 'actorName'],
      where: { projectId },
      _count: { actorId: true },
      orderBy: { _count: { actorId: 'desc' } },
      take: 1
    })
  ]);

  const topResourceType = topResourceTypeGroup[0]
    ? {
        type: topResourceTypeGroup[0].resourceType as string,
        count: topResourceTypeGroup[0]._count.resourceType
      }
    : null;

  const topActor = topActorGroup[0]
    ? {
        name: topActorGroup[0].actorName,
        count: topActorGroup[0]._count.actorId
      }
    : null;

  return NextResponse.json({ total, topResourceType, topActor });
};

export const GET = withAuth(summaryHandler);
