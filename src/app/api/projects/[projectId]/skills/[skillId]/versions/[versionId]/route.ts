/**
 * DELETE /api/projects/[projectId]/skills/[skillId]/versions/[versionId]
 * Deletes a single version snapshot (org owner/moderator only).
 * Guarded: a Skill must always keep at least one version, and the
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
  const skillId = params.skillId as string;
  const versionId = params.versionId as string;

  if (!workspaceId) {
    return NextResponse.json({ error: 'No active workspace' }, { status: 400 });
  }

  const skill = await prisma.skill.findFirst({
    where: {
      id: skillId,
      projectId,
      project: { organizationId: workspaceId, deletedAt: null }
    }
  });
  if (!skill) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const access = await getProjectAccess(projectId, userId, workspaceId);
  if (!canManageProject(access)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const targetVersion = await prisma.skillVersion.findFirst({
    where: { id: versionId, skillId }
  });
  if (!targetVersion) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }

  if (targetVersion.id === skill.mainVersionId) {
    return NextResponse.json(
      {
        error: 'Set a different version as main before deleting this one.',
        code: 'cannot_delete_main_version'
      },
      { status: 400 }
    );
  }

  const versionCount = await prisma.skillVersion.count({
    where: { skillId }
  });
  if (versionCount <= 1) {
    return NextResponse.json(
      {
        error: 'A skill must always have at least one version.',
        code: 'cannot_delete_last_version'
      },
      { status: 400 }
    );
  }

  await prisma.skillVersion.delete({ where: { id: versionId } });

  await recordProjectActivity({
    projectId,
    actorId: userId,
    actorName: apiContext.session.user.name ?? 'Unknown',
    action: 'skill_version.deleted',
    resourceType: 'skill',
    resourceId: skillId,
    resourceTitle: skill.title
  });

  return NextResponse.json({ success: true });
};

export const DELETE = withAuth(deleteHandler);
