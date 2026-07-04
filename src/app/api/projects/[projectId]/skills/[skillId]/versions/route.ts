/**
 * GET /api/projects/[projectId]/skills/[skillId]/versions — list version history for a Skill (any access required)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import { getProjectAccess } from '@/lib/permissions/project-access';

const listHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const skillId = params.skillId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const skill = await prisma.skill.findFirst({
    where: {
      id: skillId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    select: { version: true, mainVersionId: true }
  });
  if (!skill) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const versions = await prisma.skillVersion.findMany({
    where: { skillId },
    include: { createdBy: { select: AUTHOR_SELECT } },
    orderBy: { version: 'desc' }
  });

  return NextResponse.json({
    versions,
    mainVersionId: skill.mainVersionId,
    latestVersion: skill.version
  });
};

export const GET = withAuth(listHandler);
