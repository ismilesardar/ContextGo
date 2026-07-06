/**
 * POST /api/projects/[projectId]/contexts/[contextId]/versions/[versionId]/set-main
 * Repoints the Context's active/Main version at an existing ContextVersion snapshot
 * and mirrors its content onto the live Context row (org owner/moderator only).
 * Does not change the version counter and does not create a new ContextVersion —
 * unlike the old "restore" flow, this is a pointer move, not a new commit.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const AUTHOR_SELECT = { id: true, name: true, image: true } as const;

const setMainHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const contextId = params.contextId as string;
  const versionId = params.versionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const context = await prisma.context.findFirst({
    where: {
      id: contextId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
  if (!context) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const targetVersion = await prisma.contextVersion.findFirst({
    where: { id: versionId, contextId }
  });
  if (!targetVersion) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }

  const updated = await prisma.context.update({
    where: { id: contextId },
    data: {
      title: targetVersion.title,
      description: targetVersion.description,
      content: targetVersion.content,
      updatedById: userId,
      mainVersionId: targetVersion.id
    },
    include: {
      createdBy: { select: AUTHOR_SELECT },
      updatedBy: { select: AUTHOR_SELECT },
      mainVersion: { select: { id: true, version: true } }
    }
  });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'context_version.set_main',
    resourceType: 'context',
    resourceId: contextId,
    resourceTitle: updated.title
  });

  return NextResponse.json({ context: updated });
};

export const POST = withAuth(setMainHandler);
