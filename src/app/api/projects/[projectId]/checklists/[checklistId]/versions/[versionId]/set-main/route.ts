/**
 * POST /api/projects/[projectId]/checklists/[checklistId]/versions/[versionId]/set-main
 * Repoints the Checklist's active/Main version at an existing ChecklistVersion snapshot
 * and mirrors its content onto the live Checklist row (org owner/moderator only).
 * Does not change the version counter and does not create a new ChecklistVersion —
 * unlike the old "restore" flow, this is a pointer move, not a new commit.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import { AUTHOR_SELECT } from '@/lib/api/author-select';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const setMainHandler: ApiHandler = async (_req, { apiContext, params }) => {
  const { userId, workspaceId } = apiContext;
  const projectId = params.projectId as string;
  const checklistId = params.checklistId as string;
  const versionId = params.versionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const checklist = await prisma.checklist.findFirst({
    where: {
      id: checklistId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
  if (!checklist) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const targetVersion = await prisma.checklistVersion.findFirst({
    where: { id: versionId, checklistId }
  });
  if (!targetVersion) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }

  const updated = await prisma.checklist.update({
    where: { id: checklistId },
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
    action: 'checklist_version.set_main',
    resourceType: 'checklist',
    resourceId: checklistId,
    resourceTitle: updated.title
  });

  return NextResponse.json({ checklist: updated });
};

export const POST = withAuth(setMainHandler);
