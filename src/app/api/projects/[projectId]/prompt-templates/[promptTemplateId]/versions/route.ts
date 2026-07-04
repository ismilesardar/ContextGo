/**
 * GET /api/projects/[projectId]/prompt-templates/[promptTemplateId]/versions — list version history for a PromptTemplate (any access required)
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import { getProjectAccess } from '@/lib/permissions/project-access';

const listHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const promptTemplateId = params.promptTemplateId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!access) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const promptTemplate = await prisma.promptTemplate.findFirst({
    where: {
      id: promptTemplateId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    },
    select: { version: true, mainVersionId: true }
  });
  if (!promptTemplate) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const versions = await prisma.promptTemplateVersion.findMany({
    where: { promptTemplateId },
    include: { createdBy: { select: AUTHOR_SELECT } },
    orderBy: { version: 'desc' }
  });

  return NextResponse.json({
    versions,
    mainVersionId: promptTemplate.mainVersionId,
    latestVersion: promptTemplate.version
  });
};

export const GET = withAuth(listHandler);
