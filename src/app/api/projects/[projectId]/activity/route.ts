/**
 * GET /api/projects/[projectId]/activity — chronological activity feed for a project
 * (any project access required — this is a read-only feed, not gated to org admins).
 * Cursor-paginated (not offset-based): append-only logs degrade badly under OFFSET
 * pagination once every mutation across 6+ resource types is logged here.
 *
 * Query params: resourceType?, actorId?, action?, cursor? (an activity id)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { getProjectAccess } from '@/lib/permissions/project-access';

const PAGE_SIZE = 30;

const listHandler: ApiHandler = async (
  _req,
  { apiContext, params, searchParams }
) => {
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

  const resourceType = searchParams.get('resourceType');
  const actorId = searchParams.get('actorId');
  const action = searchParams.get('action');
  const cursor = searchParams.get('cursor');

  const activities = await prisma.projectActivity.findMany({
    where: {
      projectId,
      ...(resourceType ? { resourceType } : {}),
      ...(actorId ? { actorId } : {}),
      ...(action ? { action } : {})
    },
    orderBy: { createdAt: 'desc' },
    take: PAGE_SIZE + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {})
  });

  const hasMore = activities.length > PAGE_SIZE;
  const page = hasMore ? activities.slice(0, PAGE_SIZE) : activities;
  const nextCursor = hasMore ? page[page.length - 1].id : null;

  return NextResponse.json({ activities: page, nextCursor });
};

export const GET = withAuth(listHandler);
