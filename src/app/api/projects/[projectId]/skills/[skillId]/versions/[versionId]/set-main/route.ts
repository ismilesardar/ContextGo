/**
 * POST /api/projects/[projectId]/skills/[skillId]/versions/[versionId]/set-main
 * Repoints the Skill's active/Main version at an existing SkillVersion snapshot
 * and mirrors its content onto the live Skill row (org owner/moderator only).
 * Does not change the version counter and does not create a new SkillVersion —
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

const setMainHandler: ApiHandler = async (_req, { apiContext, params }) => {
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

  const updated = await prisma.skill.update({
    where: { id: skillId },
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

  return NextResponse.json({ skill: updated });
};

export const POST = withAuth(setMainHandler);
