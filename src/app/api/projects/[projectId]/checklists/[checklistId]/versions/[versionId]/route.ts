/**
 * DELETE /api/projects/[projectId]/checklists/[checklistId]/versions/[versionId]
 * Deletes a single version snapshot (org owner/moderator only).
 * Guarded: a Checklist must always keep at least one version, and the
 * currently-Main version can never be deleted directly — set a different
 * version as Main first.
 */

import { NextResponse } from 'next/server';
import { withAuth, type ApiHandler } from '@/lib/api/base-handler';
import prisma from '@/lib/prisma';
import {
  getProjectAccess,
  canManageProject
} from '@/lib/permissions/project-access';
import { recordProjectActivity } from '@/lib/api/project-activity/record-project-activity';

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
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

  if (targetVersion.id === checklist.mainVersionId) {
    return NextResponse.json(
      {
        error: 'Set a different version as main before deleting this one.',
        code: 'cannot_delete_main_version'
      },
      { status: 400 }
    );
  }

  const versionCount = await prisma.checklistVersion.count({
    where: { checklistId }
  });
  if (versionCount <= 1) {
    return NextResponse.json(
      {
        error: 'A checklist must always have at least one version.',
        code: 'cannot_delete_last_version'
      },
      { status: 400 }
    );
  }

  await prisma.checklistVersion.delete({ where: { id: versionId } });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'checklist_version.deleted',
    resourceType: 'checklist',
    resourceId: checklistId,
    resourceTitle: checklist.title
  });

  return NextResponse.json({ success: true });
};

export const DELETE = withAuth(deleteHandler);
