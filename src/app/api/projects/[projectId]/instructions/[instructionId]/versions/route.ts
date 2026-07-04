/**
 * GET /api/projects/[projectId]/instructions/[instructionId]/versions — list version history for a Instruction (any access required)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import { getProjectAccess } from '@/lib/permissions/project-access';

const listHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const instructionId = params.instructionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const instruction = await prisma.instruction.findFirst({
    where: {
      id: instructionId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    select: { version: true, mainVersionId: true }
  });
  if (!instruction) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const versions = await prisma.instructionVersion.findMany({
    where: { instructionId },
    include: { createdBy: { select: AUTHOR_SELECT } },
    orderBy: { version: 'desc' }
  });

  return NextResponse.json({
    versions,
    mainVersionId: instruction.mainVersionId,
    latestVersion: instruction.version
  });
};

export const GET = withAuth(listHandler);
