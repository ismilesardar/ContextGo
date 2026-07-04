/**
 * DELETE /api/projects/[projectId]/contexts/[contextId]/versions/[versionId]
 * Deletes a single version snapshot (org owner/moderator only).
 * Guarded: a Context must always keep at least one version, and the
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

const deleteHandler: ApiHandler = async (_req, { apiContext, params }) => {
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

  if (targetVersion.id === context.mainVersionId) {
    return NextResponse.json(
      {
        error: 'Set a different version as main before deleting this one.',
        code: 'cannot_delete_main_version'
      },
      { status: 400 }
    );
  }

  const versionCount = await prisma.contextVersion.count({
    where: { contextId }
  });
  if (versionCount <= 1) {
    return NextResponse.json(
      {
        error: 'A context must always have at least one version.',
        code: 'cannot_delete_last_version'
      },
      { status: 400 }
    );
  }

  await prisma.contextVersion.delete({ where: { id: versionId } });

  return NextResponse.json({ success: true });
};

export const DELETE = withAuth(deleteHandler);
